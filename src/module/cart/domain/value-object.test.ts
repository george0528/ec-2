import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CartId, ItemId, Price, Quantity, OccurredOn } from './value-object'
import { ValidationException } from '@ec/common'

describe('CartId', () => {
  it('should create a new CartId with valid UUID', () => {
    const cartId = CartId.create()
    expect(cartId.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  })

  it('should create CartId from valid string', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000'
    const cartId = CartId.of(validId)
    expect(cartId.value).toBe(validId)
  })

  it('should throw ValidationException for invalid ID', () => {
    expect(() => CartId.of('')).toThrow(ValidationException)
    expect(() => CartId.of('invalid-id')).toThrow(ValidationException)
  })

  it('should check equality correctly', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000'
    const cartId1 = CartId.of(id)
    const cartId2 = CartId.of(id)
    const cartId3 = CartId.of('550e8400-e29b-41d4-a716-446655440001')

    expect(cartId1.equals(cartId2)).toBe(true)
    expect(cartId1.equals(cartId3)).toBe(false)
  })
})

describe('ItemId', () => {
  it('should create a new ItemId with valid UUID', () => {
    const itemId = ItemId.create()
    expect(itemId.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  })

  it('should create ItemId from valid string', () => {
    const validId = '550e8400-e29b-41d4-a716-446655440000'
    const itemId = ItemId.of(validId)
    expect(itemId.value).toBe(validId)
  })

  it('should throw ValidationException for invalid ID', () => {
    expect(() => ItemId.of('')).toThrow(ValidationException)
    expect(() => ItemId.of('invalid-id')).toThrow(ValidationException)
  })

  it('should check equality correctly', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000'
    const itemId1 = ItemId.of(id)
    const itemId2 = ItemId.of(id)
    const itemId3 = ItemId.of('550e8400-e29b-41d4-a716-446655440001')

    expect(itemId1.equals(itemId2)).toBe(true)
    expect(itemId1.equals(itemId3)).toBe(false)
  })
})

describe('Price', () => {
  it('should create Price with valid positive number', () => {
    const price = Price.of(100)
    expect(price.value).toBe(100)
  })

  it('should create zero price', () => {
    const price = Price.zero()
    expect(price.value).toBe(0)
  })

  it('should throw ValidationException for negative price', () => {
    expect(() => Price.of(-1)).toThrow(ValidationException)
  })

  it('should check equality correctly', () => {
    const price1 = Price.of(100)
    const price2 = Price.of(100)
    const price3 = Price.of(200)

    expect(price1.equals(price2)).toBe(true)
    expect(price1.equals(price3)).toBe(false)
  })

  it('should add prices correctly', () => {
    const price1 = Price.of(100)
    const price2 = Price.of(50)
    const result = price1.add(price2)

    expect(result.value).toBe(150)
    expect(result).not.toBe(price1) // immutability check
  })
})

describe('Quantity', () => {
  it('should create Quantity with valid positive number', () => {
    const quantity = Quantity.of(5)
    expect(quantity.value).toBe(5)
  })

  it('should throw ValidationException for negative quantity', () => {
    expect(() => Quantity.of(-1)).toThrow(ValidationException)
  })

  it('should check equality correctly', () => {
    const quantity1 = Quantity.of(5)
    const quantity2 = Quantity.of(5)
    const quantity3 = Quantity.of(10)

    expect(quantity1.equals(quantity2)).toBe(true)
    expect(quantity1.equals(quantity3)).toBe(false)
  })

  it('should add quantities correctly', () => {
    const quantity1 = Quantity.of(3)
    const quantity2 = Quantity.of(2)
    const result = quantity1.add(quantity2)

    expect(result.value).toBe(5)
    expect(result).not.toBe(quantity1) // immutability check
  })
})

describe('OccurredOn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should create OccurredOn with valid Date', () => {
    const date = new Date('2023-12-01T10:00:00Z')
    const occurredOn = OccurredOn.of(date)
    expect(occurredOn.value).toBe(date)
  })

  it('should create OccurredOn with current time', () => {
    const mockDate = new Date('2023-12-01T10:00:00Z')
    vi.setSystemTime(mockDate)

    const occurredOn = OccurredOn.now()
    expect(occurredOn.value).toEqual(mockDate)
  })

  it('should throw ValidationException for invalid date', () => {
    const invalidDate = new Date('invalid')
    expect(() => OccurredOn.of(invalidDate)).toThrow(ValidationException)
  })

  it('should check equality correctly', () => {
    const date1 = new Date('2023-12-01T10:00:00Z')
    const date2 = new Date('2023-12-01T10:00:00Z')
    const date3 = new Date('2023-12-01T11:00:00Z')

    const occurredOn1 = OccurredOn.of(date1)
    const occurredOn2 = OccurredOn.of(date2)
    const occurredOn3 = OccurredOn.of(date3)

    expect(occurredOn1.equals(occurredOn2)).toBe(true)
    expect(occurredOn1.equals(occurredOn3)).toBe(false)
  })
})