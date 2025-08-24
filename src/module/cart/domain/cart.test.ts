import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cart, CartItem } from './cart'
import { CartId, ItemId, Price, Quantity, OccurredOn } from './value-object'
import { 
  ItemAddedEvent, 
  ItemRemovedEvent, 
  ItemQuantityUpdatedEvent,
  CartEventType 
} from './event'

describe('カート', () => {
  let cartId: CartId
  let itemId1: ItemId
  let itemId2: ItemId
  let price1: Price
  let price2: Price
  let quantity1: Quantity
  let quantity2: Quantity
  let cartItem1: CartItem
  let cartItem2: CartItem

  beforeEach(() => {
    cartId = CartId.create()
    itemId1 = ItemId.create()
    itemId2 = ItemId.create()
    price1 = Price.of(100)
    price2 = Price.of(200)
    quantity1 = Quantity.of(2)
    quantity2 = Quantity.of(3)
    
    cartItem1 = {
      itemId: itemId1,
      price: price1,
      quantity: quantity1
    }
    
    cartItem2 = {
      itemId: itemId2,
      price: price2,
      quantity: quantity2
    }
  })

  describe('作成', () => {
    it('空のカートを作成できる', () => {
      const cart = Cart.create([])
      
      expect(cart.cartId).toBeDefined()
      expect(cart.totalPrice).toBe(0)
      expect(cart.pendingEvents).toHaveLength(0)
    })

    it('初期アイテム付きでカートを作成できる', () => {
      const cart = Cart.create([cartItem1, cartItem2])
      
      expect(cart.cartId).toBeDefined()
      expect(cart.totalPrice).toBe(800) // (100*2) + (200*3) = 800
      expect(cart.pendingEvents).toHaveLength(0)
    })
  })

  describe('アイテム追加', () => {
    it('空のカートにアイテムを追加できる', () => {
      const cart = Cart.create([])
      const newCart = cart.addItem(cartItem1)
      
      expect(newCart).not.toBe(cart) // immutability
      expect(newCart.totalPrice).toBe(200) // 100*2
      expect(newCart.pendingEvents).toHaveLength(1)
      
      const event = newCart.pendingEvents[0]
      expect(event.eventType).toBe(CartEventType.ITEM_ADDED)
      expect(event).toBeInstanceOf(ItemAddedEvent)
      
      if (event.eventType === CartEventType.ITEM_ADDED) {
        expect(event.itemId).toBe(cartItem1.itemId)
        expect(event.price).toBe(cartItem1.price)
        expect(event.quantity).toBe(cartItem1.quantity)
      }
    })

    it('既存のカートにアイテムを追加できる', () => {
      const cart = Cart.create([cartItem1])
      const newCart = cart.addItem(cartItem2)
      
      expect(newCart.totalPrice).toBe(800) // (100*2) + (200*3)
      expect(newCart.pendingEvents).toHaveLength(1)
    })
  })

  describe('アイテム削除', () => {
    it('既存のアイテムを削除できる', () => {
      const cart = Cart.create([cartItem1, cartItem2])
      const newCart = cart.removeItem(itemId1)
      
      expect(newCart).not.toBe(cart) // immutability
      expect(newCart.totalPrice).toBe(600) // only 200*3 remains
      expect(newCart.pendingEvents).toHaveLength(1)
      
      const event = newCart.pendingEvents[0]
      expect(event.eventType).toBe(CartEventType.ITEM_REMOVED)
      expect(event).toBeInstanceOf(ItemRemovedEvent)
      
      if (event.eventType === CartEventType.ITEM_REMOVED) {
        expect(event.itemId).toBe(itemId1)
      }
    })

    it('存在しないアイテムの場合は同じカートを返す', () => {
      const cart = Cart.create([cartItem1])
      const nonExistentItemId = ItemId.create()
      const newCart = cart.removeItem(nonExistentItemId)
      
      expect(newCart).toBe(cart) // same instance returned
      expect(newCart.totalPrice).toBe(200)
      expect(newCart.pendingEvents).toHaveLength(0)
    })

    it('アイテムIDがnull/undefinedの場合は同じカートを返す', () => {
      const cart = Cart.create([cartItem1])
      const newCart = cart.removeItem(null as any)
      
      expect(newCart).toBe(cart)
    })
  })

  describe('アイテム数量更新', () => {
    it('既存アイテムの数量を更新できる', () => {
      const cart = Cart.create([cartItem1])
      const newQuantity = Quantity.of(5)
      const newCart = cart.updateItemQuantity(itemId1, newQuantity)
      
      expect(newCart).not.toBe(cart) // immutability
      expect(newCart.totalPrice).toBe(500) // 100*5
      expect(newCart.pendingEvents).toHaveLength(1)
      
      const event = newCart.pendingEvents[0]
      expect(event.eventType).toBe(CartEventType.ITEM_QUANTITY_UPDATED)
      expect(event).toBeInstanceOf(ItemQuantityUpdatedEvent)
      
      if (event.eventType === CartEventType.ITEM_QUANTITY_UPDATED) {
        expect(event.itemId).toBe(itemId1)
        expect(event.quantity).toBe(newQuantity)
      }
    })

    it('存在しないアイテムの場合はエラーを投げる', () => {
      const cart = Cart.create([cartItem1])
      const nonExistentItemId = ItemId.create()
      const newQuantity = Quantity.of(5)
      
      expect(() => cart.updateItemQuantity(nonExistentItemId, newQuantity))
        .toThrow(`item not found: ${nonExistentItemId.value}`)
    })

    it('アイテムIDがnull/undefinedの場合は同じカートを返す', () => {
      const cart = Cart.create([cartItem1])
      const newQuantity = Quantity.of(5)
      const newCart = cart.updateItemQuantity(null as any, newQuantity)
      
      expect(newCart).toBe(cart)
    })
  })

  describe('イベント再生', () => {
    it('イベントを再生してカート状態を再構築できる', () => {
      const cart = Cart.create([])
      
      const addEvent = ItemAddedEvent.create(
        cart.cartId,
        OccurredOn.now(),
        itemId1,
        price1,
        quantity1
      )
      
      const updateEvent = ItemQuantityUpdatedEvent.create(
        cart.cartId,
        OccurredOn.now(),
        itemId1,
        Quantity.of(5)
      )
      
      const replayedCart = cart.replay([addEvent, updateEvent])
      
      expect(replayedCart).not.toBe(cart)
      expect(replayedCart.totalPrice).toBe(500) // 100*5
      expect(replayedCart.pendingEvents).toHaveLength(0) // no pending events in replay
    })

    it('複数のイベントを正しく処理できる', () => {
      const cart = Cart.create([])
      
      const addEvent1 = ItemAddedEvent.create(
        cart.cartId,
        OccurredOn.now(),
        itemId1,
        price1,
        quantity1
      )
      
      const addEvent2 = ItemAddedEvent.create(
        cart.cartId,
        OccurredOn.now(),
        itemId2,
        price2,
        quantity2
      )
      
      const removeEvent = ItemRemovedEvent.create(
        cart.cartId,
        OccurredOn.now(),
        itemId1
      )
      
      const replayedCart = cart.replay([addEvent1, addEvent2, removeEvent])
      
      expect(replayedCart.totalPrice).toBe(600) // only item2: 200*3
      expect(replayedCart.pendingEvents).toHaveLength(0)
    })
  })

  describe('合計金額', () => {
    it('合計金額を正しく計算できる', () => {
      const cart = Cart.create([cartItem1, cartItem2])
      
      expect(cart.totalPrice).toBe(800) // (100*2) + (200*3)
    })

    it('空のカートの場合は0を返す', () => {
      const cart = Cart.create([])
      
      expect(cart.totalPrice).toBe(0)
    })
  })

  describe('不変性', () => {
    it('アイテム追加時に元のカートを変更しない', () => {
      const originalCart = Cart.create([cartItem1])
      const originalPrice = originalCart.totalPrice
      const originalEventsLength = originalCart.pendingEvents.length
      
      const newCart = originalCart.addItem(cartItem2)
      
      expect(originalCart.totalPrice).toBe(originalPrice)
      expect(originalCart.pendingEvents.length).toBe(originalEventsLength)
      expect(newCart).not.toBe(originalCart)
    })

    it('アイテム削除時に元のカートを変更しない', () => {
      const originalCart = Cart.create([cartItem1, cartItem2])
      const originalPrice = originalCart.totalPrice
      const originalEventsLength = originalCart.pendingEvents.length
      
      const newCart = originalCart.removeItem(itemId1)
      
      expect(originalCart.totalPrice).toBe(originalPrice)
      expect(originalCart.pendingEvents.length).toBe(originalEventsLength)
      expect(newCart).not.toBe(originalCart)
    })

    it('数量更新時に元のカートを変更しない', () => {
      const originalCart = Cart.create([cartItem1])
      const originalPrice = originalCart.totalPrice
      const originalEventsLength = originalCart.pendingEvents.length
      
      const newCart = originalCart.updateItemQuantity(itemId1, Quantity.of(10))
      
      expect(originalCart.totalPrice).toBe(originalPrice)
      expect(originalCart.pendingEvents.length).toBe(originalEventsLength)
      expect(newCart).not.toBe(originalCart)
    })
  })

  describe('イベント蓄積', () => {
    it('複数のイベントを蓄積できる', () => {
      const cart = Cart.create([])
      
      const cart1 = cart.addItem(cartItem1)
      const cart2 = cart1.addItem(cartItem2)
      const cart3 = cart2.updateItemQuantity(itemId1, Quantity.of(5))
      
      expect(cart3.pendingEvents).toHaveLength(3)
      expect(cart3.pendingEvents[0].eventType).toBe(CartEventType.ITEM_ADDED)
      expect(cart3.pendingEvents[1].eventType).toBe(CartEventType.ITEM_ADDED)
      expect(cart3.pendingEvents[2].eventType).toBe(CartEventType.ITEM_QUANTITY_UPDATED)
    })
  })
})