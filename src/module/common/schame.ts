import { z } from 'zod';

export const createIdSchema = (fieldLabel: string) => {
  return z.string().refine(
    (val) => {
      try {
        z.string().uuid().parse(val)
        return true;
      } catch {
        return false;
      }
    },
    {
      message: `${fieldLabel} はUUID形式である必要があります`,
    }
  );
};

export const createPositiveNumberSchema = (fieldLabel: string) => {
  return z.number().min(0, { message: `${fieldLabel} は0以上である必要があります` });
}

export const createDateSchema = (fieldLabel: string) => {
  return z.date().refine(
    (date) => !isNaN(date.getTime()),
    { message: `${fieldLabel} は有効な日付である必要があります` }
  );
}

