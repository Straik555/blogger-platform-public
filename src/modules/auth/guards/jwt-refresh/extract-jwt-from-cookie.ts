import { Request } from 'express';

import { FieldNames } from '../../../../core/constants/field-names.constant';

export const extractJwtFromCookie = (req: Request): string | null => {
  const refreshToken = req.cookies[FieldNames.REFRESH_TOKEN] as string;
  if (!refreshToken) return null;
  return refreshToken;
};
