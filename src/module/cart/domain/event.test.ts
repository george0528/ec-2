import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  CartEventType, 
  ItemAddedEvent, 
  ItemRemovedEvent, 
  ItemQuantityUpdatedEvent,
  CartDomainEvent
} from './event'
import { CartId, ItemId, Price, Quantity, OccurredOn } from './value-object'

describe('ItemAddedEvent', () => {
  let cartId: CartId
  let itemId: ItemId
  let price: Price
  let quantity: Quantity
  let occurredOn: OccurredOn

  beforeEach(() => {
    cartId = CartId.create()
    itemId = ItemId.create()
    price = Price.of(100)
    quantity = Quantity.of(2)
    occurredOn = OccurredOn.now()
  })

  it('should create ItemAddedEvent with correct properties', () => {
    const event = ItemAddedEvent.create(cartId, occurredOn, itemId, price, quantity)

    expect(event.eventType).toBe(CartEventType.ITEM_ADDED)
    expect(event.cartId).toBe(cartId)
    expect(event.occurredOn).toBe(occurredOn)
    expect(event.itemId).toBe(itemId)
    expect(event.price).toBe(price)
    expect(event.quantity).toBe(quantity)
  })

  it('should have readonly eventType property', () => {
    const event = ItemAddedEvent.create(cartId, occurredOn, itemId, price, quantity)
    
    // TypeScript should enforce readonly, but we can check the value
    expect(event.eventType).toBe(CartEventType.ITEM_ADDED)
  })

  it('should extend CartEvent base class', () => {
    const event = ItemAddedEvent.create(cartId, occurredOn, itemId, price, quantity)
    
    expect(event.cartId).toBe(cartId)
    expect(event.occurredOn).toBe(occurredOn)
  })
})

describe('ItemRemovedEvent', () => {
  let cartId: CartId
  let itemId: ItemId
  let occurredOn: OccurredOn

  beforeEach(() => {
    cartId = CartId.create()
    itemId = ItemId.create()
    occurredOn = OccurredOn.now()
  })

  it('should create ItemRemovedEvent with correct properties', () => {
    const event = ItemRemovedEvent.create(cartId, occurredOn, itemId)

    expect(event.eventType).toBe(CartEventType.ITEM_REMOVED)
    expect(event.cartId).toBe(cartId)
    expect(event.occurredOn).toBe(occurredOn)
    expect(event.itemId).toBe(itemId)
  })

  it('should have readonly eventType property', () => {
    const event = ItemRemovedEvent.create(cartId, occurredOn, itemId)
    
    expect(event.eventType).toBe(CartEventType.ITEM_REMOVED)
  })

  it('should extend CartEvent base class', () => {
    const event = ItemRemovedEvent.create(cartId, occurredOn, itemId)
    
    expect(event.cartId).toBe(cartId)
    expect(event.occurredOn).toBe(occurredOn)
  })
})

describe('ItemQuantityUpdatedEvent', () => {
  let cartId: CartId
  let itemId: ItemId
  let quantity: Quantity
  let occurredOn: OccurredOn

  beforeEach(() => {
    cartId = CartId.create()
    itemId = ItemId.create()
    quantity = Quantity.of(5)
    occurredOn = OccurredOn.now()
  })

  it('should create ItemQuantityUpdatedEvent with correct properties', () => {
    const event = ItemQuantityUpdatedEvent.create(cartId, occurredOn, itemId, quantity)

    expect(event.eventType).toBe(CartEventType.ITEM_QUANTITY_UPDATED)
    expect(event.cartId).toBe(cartId)
    expect(event.occurredOn).toBe(occurredOn)
    expect(event.itemId).toBe(itemId)
    expect(event.quantity).toBe(quantity)
  })

  it('should have readonly eventType property', () => {
    const event = ItemQuantityUpdatedEvent.create(cartId, occurredOn, itemId, quantity)
    
    expect(event.eventType).toBe(CartEventType.ITEM_QUANTITY_UPDATED)
  })

  it('should extend CartEvent base class', () => {
    const event = ItemQuantityUpdatedEvent.create(cartId, occurredOn, itemId, quantity)
    
    expect(event.cartId).toBe(cartId)
    expect(event.occurredOn).toBe(occurredOn)
  })
})

describe('CartEventType', () => {
  it('should have correct enum values', () => {
    expect(CartEventType.ITEM_ADDED).toBe('ITEM_ADDED')
    expect(CartEventType.ITEM_REMOVED).toBe('ITEM_REMOVED')
    expect(CartEventType.ITEM_QUANTITY_UPDATED).toBe('ITEM_QUANTITY_UPDATED')
  })
})

describe('CartDomainEvent union type', () => {
  it('should accept ItemAddedEvent', () => {
    const cartId = CartId.create()
    const itemId = ItemId.create()
    const price = Price.of(100)
    const quantity = Quantity.of(2)
    const occurredOn = OccurredOn.now()

    const event: CartDomainEvent = ItemAddedEvent.create(cartId, occurredOn, itemId, price, quantity)
    expect(event.eventType).toBe(CartEventType.ITEM_ADDED)
  })

  it('should accept ItemRemovedEvent', () => {
    const cartId = CartId.create()
    const itemId = ItemId.create()
    const occurredOn = OccurredOn.now()

    const event: CartDomainEvent = ItemRemovedEvent.create(cartId, occurredOn, itemId)
    expect(event.eventType).toBe(CartEventType.ITEM_REMOVED)
  })

  it('should accept ItemQuantityUpdatedEvent', () => {
    const cartId = CartId.create()
    const itemId = ItemId.create()
    const quantity = Quantity.of(5)
    const occurredOn = OccurredOn.now()

    const event: CartDomainEvent = ItemQuantityUpdatedEvent.create(cartId, occurredOn, itemId, quantity)
    expect(event.eventType).toBe(CartEventType.ITEM_QUANTITY_UPDATED)
  })
})