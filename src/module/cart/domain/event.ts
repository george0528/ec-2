// Domain types
import { CartId, ItemId, Price, Quantity, OccurredOn } from "./value-object";

export enum CartEventType {
  ITEM_ADDED = "ITEM_ADDED",
  ITEM_REMOVED = "ITEM_REMOVED",
  ITEM_QUANTITY_UPDATED = "ITEM_QUANTITY_UPDATED",
}

abstract class CartEvent {
  abstract readonly eventType: CartEventType;
  protected constructor(
    public cartId: CartId,
    public occurredOn: OccurredOn,
  ) {}
}

export class ItemAddedEvent extends CartEvent {
  public readonly eventType = CartEventType.ITEM_ADDED as const;

  private constructor(
    cartId: CartId,
    occurredOn: OccurredOn,
    public readonly itemId: ItemId,
    public readonly price: Price,
    public readonly quantity: Quantity,
  ) {
    super(cartId, occurredOn);
  }

  static create(
    cartId: CartId,
    occurredOn: OccurredOn,
    itemId: ItemId,
    price: Price,
    quantity: Quantity,
  ): ItemAddedEvent {
    return new ItemAddedEvent(cartId, occurredOn, itemId, price, quantity);
  }
}

export class ItemRemovedEvent extends CartEvent {
  public readonly eventType = CartEventType.ITEM_REMOVED as const;
  private constructor(
    cartId: CartId,
    occurredOn: OccurredOn,
    public readonly itemId: ItemId,
  ) {
    super(cartId, occurredOn);
  }

  static create(
    cartId: CartId,
    occurredOn: OccurredOn,
    itemId: ItemId,
  ): ItemRemovedEvent {
    return new ItemRemovedEvent(cartId, occurredOn, itemId);
  }
}

export class ItemQuantityUpdatedEvent extends CartEvent {
  public readonly eventType = CartEventType.ITEM_QUANTITY_UPDATED as const;
  private constructor(
    cartId: CartId,
    occurredOn: OccurredOn,
    public readonly itemId: ItemId,
    public readonly quantity: Quantity,
  ) {
    super(cartId, occurredOn);
  }

  static create(
    cartId: CartId,
    occurredOn: OccurredOn,
    itemId: ItemId,
    quantity: Quantity,
  ): ItemQuantityUpdatedEvent {
    return new ItemQuantityUpdatedEvent(cartId, occurredOn, itemId, quantity);
  }
}

export type CartDomainEvent =
  | ItemAddedEvent
  | ItemRemovedEvent
  | ItemQuantityUpdatedEvent;
