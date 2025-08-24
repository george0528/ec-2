import { v4 as uuidv4 } from "uuid";
import {
  createDateSchema,
  createIdSchema,
  createPositiveNumberSchema,
  ValidationException,
} from "@ec/common";
import { ZodError } from "zod";

/** カートID値オブジェクト */
export class CartId {
  private constructor(public readonly value: string) {
    try {
      createIdSchema("CartId").parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw ValidationException.fromZodError(error);
      }
      throw error;
    }
  }

  equals(other: CartId): boolean {
    return this.value === other.value;
  }

  static of(value: string): CartId {
    return new CartId(value);
  }

  static create(): CartId {
    return new CartId(uuidv4());
  }
}

/** アイテムID値オブジェクト */
export class ItemId {
  private constructor(public readonly value: string) {
    try {
      createIdSchema("ItemId").parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw ValidationException.fromZodError(error);
      }
      throw error;
    }
  }

  equals(other: ItemId): boolean {
    return this.value === other.value;
  }

  static of(value: string): ItemId {
    return new ItemId(value);
  }

  static create(): ItemId {
    return new ItemId(uuidv4());
  }
}

/** 価格値オブジェクト */
export class Price {
  private constructor(public readonly value: number) {
    try {
      createPositiveNumberSchema("Price").parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw ValidationException.fromZodError(error);
      }
      throw error;
    }
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }

  add(other: Price): Price {
    return new Price(this.value + other.value);
  }

  static of(value: number): Price {
    return new Price(value);
  }

  static zero(): Price {
    return new Price(0);
  }
}

/** 数量値オブジェクト */
export class Quantity {
  private constructor(public readonly value: number) {
    try {
      createPositiveNumberSchema("Quantity").parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw ValidationException.fromZodError(error);
      }
      throw error;
    }
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }

  static of(value: number): Quantity {
    return new Quantity(value);
  }
}

/** 発生日時値オブジェクト */
export class OccurredOn {
  private constructor(public readonly value: Date) {
    try {
      createDateSchema("OccurredOn").parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw ValidationException.fromZodError(error);
      }
      throw error;
    }
  }

  equals(other: OccurredOn): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  static of(value: Date): OccurredOn {
    return new OccurredOn(value);
  }

  static now(): OccurredOn {
    return new OccurredOn(new Date());
  }
}
