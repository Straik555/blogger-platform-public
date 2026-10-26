import { DomainExceptionCode } from './domain/domain-exception-codes';
import { ValidationErrorItemViewDto } from './dto/view-dto/validation-error-item.view-dto';

export type ErrorResponseBodyAdminType = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: ValidationErrorItemViewDto[];
  code: DomainExceptionCode;
};
