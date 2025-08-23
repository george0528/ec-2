# カートコンテキスト

## ドメインモデル図
```mermaid
classDiagram
  class Cart {
    +cartId: CartId
    +items: List<CartItem>
    -pendingEvents: List<CartEvent>
    +addItem(item: CartItem): Cart
    +removeItem(itemId: String): Cart
    +updateItemQuantity(itemId: String, quantity: int): Cart
    +replay(events: CartEvent...) Cart
    +calculateTotal() number
    +getPendingEvents(): List<CartEvent>
    +clearPendingEvents(): void
  }

  class CartItem {
    +itemId: ItemId
    +quantity: Quantity
    +price: Price
  }

  class CartEvent {
    <<interface>>
    +cartId: CartId
    +occurredOn: DateTime
  }

  class ItemAddedEvent {
    +itemId: ItemId
    +price: Price
    +quantity: Quantity
  }

  class ItemRemovedEvent {
    +itemId: ItemId
  }

  class ItemQuantityUpdatedEvent {
    +itemId: ItemId
    +quantity: Quantity
  }

  CartEvent <|-- ItemAddedEvent
  CartEvent <|-- ItemRemovedEvent
  CartEvent <|-- ItemQuantityUpdatedEvent
  Cart "1" -- "0..*" CartItem: contains
```
