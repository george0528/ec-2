import { ZodError } from "zod";

/**
 * ドメイン例外の基底クラス
 */
export class DomainException extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = "DomainException";
  }
}

/**
 * バリデーション例外
 * Zodのバリデーションエラーをラップする
 */
export class ValidationException extends DomainException {
  constructor(
    message: string,
    public readonly zodError: ZodError,
  ) {
    super(message, zodError);
    this.name = "ValidationException";
  }

  /**
   * ZodError から ValidationException を作成する
   */
  static fromZodError(zodError: ZodError): ValidationException {
    const messages = zodError.issues
      .map((issue) => {
        const path = issue.path?.length ? issue.path.join(".") + ": " : "";
        return `${path}${issue.message}`;
      })
      .join(", ");
    return new ValidationException(messages, zodError);
  }
}
