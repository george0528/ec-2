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
    public readonly pendingEvents: CartDomainEvent[] = []
  ) {
  }

  get totalPrice(): number {
    return this.calculateTotal();
  }

  addItem(item: CartItem): Cart {
    const event = ItemAddedEvent.create(
      this.cartId,
      OccurredOn.now(),
      item.itemId,
      item.price,
      item.quantity
    );

    this.pendingEvents.push(event);
    return this.applyEvent(event);
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

    this.pendingEvents.push(event);
    return this.applyEvent(event);
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

    this.pendingEvents.push(event);
    return this.applyEvent(event);
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

  static create(items: CartItem[]): Cart {
    return new Cart(CartId.create(), items);
  }

  private applyEvent(event: CartDomainEvent): Cart {
    // イベント種別はプロパティ構造で判定（type フィールド等は追加しない）
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