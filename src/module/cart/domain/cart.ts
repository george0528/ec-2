import {
  CartDomainEvent,
  ItemAddedEvent,
  ItemRemovedEvent,
  ItemQuantityUpdatedEvent,
  CartEventType,
} from './event';
import { CartId, ItemId, Price, Quantity, OccurredOn } from './value-object';
import {assertNever} from "@/module/common/assert";

export interface CartItem {
  itemId: ItemId;
  quantity: Quantity;
  price: Price;
}

/**
 * カート集約
 * - メソッドは新しい Cart を返す（不変パターン）
 * - pendingEvents は当該インスタンスで発生したドメインイベントを保持
 */
export class Cart {
  private constructor(
    public readonly cartId: CartId,
    private items: ReadonlyArray<CartItem> = [],
    public readonly pendingEvents: ReadonlyArray<CartDomainEvent> = []
  ) {
  }

  get totalPrice(): number {
    return this.calculateTotal();
  }

  static create(items: CartItem[]): Cart {
    return new Cart(CartId.create(), items);
  }

  addItem(item: CartItem): Cart {
    const event = ItemAddedEvent.create(
      this.cartId,
      OccurredOn.now(),
      item.itemId,
      item.price,
      item.quantity
    );

    return this.applyEvent(event).addPendingEvent(event);
  }

  removeItem(itemId: ItemId): Cart {
    if (!itemId) return this;

    // 存在しない場合は NO-OP
    const exists = this.items.some((i) => i.itemId.equals(itemId));
    if (!exists) return this;

    const event = ItemRemovedEvent.create(
      this.cartId,
      OccurredOn.now(),
      itemId
    );

    return this.applyEvent(event).addPendingEvent(event);
  }

  updateItemQuantity(itemId: ItemId, quantity: Quantity): Cart {
    if (!itemId) return this;

    const target = this.items.find((i) => i.itemId.equals(itemId));
    if (!target) {
      throw new Error(`item not found: ${itemId.value}`);
    }

    const event = ItemQuantityUpdatedEvent.create(
      this.cartId,
      OccurredOn.now(),
      itemId,
      quantity
    );

    return this.applyEvent(event).addPendingEvent(event);
  }

  replay(events: CartDomainEvent[]): Cart {
    let cart = new Cart(this.cartId);
    for (const event of events) {
      // リプレイでは pendingEvents に積まない
      cart = cart.applyEvent(event);
    }
    return cart;
  }

  private calculateTotal(): number {
    return this.items.reduce((sum, i) => sum + i.price.value * i.quantity.value, 0);
  }

  private addPendingEvent(event: CartDomainEvent): Cart {
    return new Cart(this.cartId, this.items, [...this.pendingEvents, event]);
  }

  private applyEvent(event: CartDomainEvent): Cart {
    switch (event.eventType) {
      case CartEventType.ITEM_ADDED:
        return new Cart(this.cartId, [
          ...this.items,
          {
            itemId: event.itemId,
            price: event.price,
            quantity: event.quantity,
          },
        ]);
      case CartEventType.ITEM_REMOVED:
        return new Cart(this.cartId, this.items.filter(i => !i.itemId.equals(event.itemId)));
      case CartEventType.ITEM_QUANTITY_UPDATED:
        return new Cart(this.cartId, this.items.map(i => {
          if (i.itemId.equals(event.itemId)) {
            return {
              ...i,
              quantity: event.quantity,
            };
          }
          return i;
        }));
      default: {
        assertNever(event);
      }
    }
  }
}