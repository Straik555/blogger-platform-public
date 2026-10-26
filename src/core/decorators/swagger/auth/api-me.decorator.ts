import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserMeViewDto } from '../../../../modules/auth/api/view-dto/user-me.view-dto';

export function ApiMe() {
  return applyDecorators(
    ApiOperation({ summary: 'Get information about current user' }),
    ApiOkResponse({
      description: 'Success',
      type: UserMeViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
}
