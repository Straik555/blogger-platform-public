import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ValidationErrorResponseViewDto } from '../../../exception/dto/view-dto/validation-error-item.view-dto';

interface ApiMutateEntityOptions {
  summary: string;
  nameParam?: string;
  typeParam?: Type<unknown> | string;
  descriptionParam?: string;
  notFound?: boolean;
  notFoundMessage?: string;
  unauthorized?: boolean;
  unauthorizedDescription?: string;
  bodyType?: Type<unknown>;
  bodyDescription?: string;
  badRequest?: boolean;
  badRequestDescription?: string;
  noContent?: boolean;
  noContentDescription?: string;
  tooManyRequests?: boolean;
  tooManyRequestsDescription?: string;
  isApiParams?: boolean;
  created?: boolean;
  responseType?: Type<unknown>;
  responseDescription?: string;
  forbidden?: boolean;
  forbiddenDescription?: string;
}

export function ApiMutateEntity(options: ApiMutateEntityOptions) {
  const decorators = [ApiOperation({ summary: options.summary })];

  const addIf = (condition: unknown, decorator: MethodDecorator) => {
    if (condition) decorators.push(decorator);
  };

  addIf(
    options.isApiParams,
    ApiParam({
      name: options.nameParam ?? 'id',
      type: options.typeParam ?? String,
      description: options.descriptionParam,
    }),
  );

  addIf(
    options.bodyType,
    ApiBody({
      type: options.bodyType,
      description: options.bodyDescription,
    }),
  );

  addIf(
    options.notFound,
    ApiNotFoundResponse({
      description: options.notFoundMessage ?? 'Not Found',
    }),
  );

  addIf(
    options.unauthorized,
    ApiUnauthorizedResponse({
      description: options.unauthorizedDescription ?? 'Unauthorized',
    }),
  );

  addIf(
    options.badRequest,
    ApiBadRequestResponse({
      description:
        options.badRequestDescription ??
        'If the inputModel has incorrect values',
      type: ValidationErrorResponseViewDto,
    }),
  );

  addIf(
    options.tooManyRequests,
    ApiTooManyRequestsResponse({
      description:
        options.tooManyRequestsDescription ??
        'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );

  addIf(
    options.noContent,
    ApiNoContentResponse({
      description: options.noContentDescription ?? 'No Content',
    }),
  );

  addIf(
    options.created,
    ApiCreatedResponse({
      description: options.responseDescription,
      type: options.responseType,
    }),
  );

  addIf(
    options.forbidden,
    ApiForbiddenResponse({
      description: options.forbiddenDescription ?? 'Forbidden',
    }),
  );

  return applyDecorators(...decorators);
}
