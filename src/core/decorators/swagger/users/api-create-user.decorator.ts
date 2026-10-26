import { UserViewDto } from '../../../../modules/users/api/view-dto/user.view-dto';
import { CreateUserDto } from '../../../../modules/users/dto/create-user.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiCreateUser() {
  return ApiMutateEntity({
    summary: 'Add new user to the system',
    bodyType: CreateUserDto,
    created: true,
    responseType: UserViewDto,
    bodyDescription: 'Data for constructing new user',
    responseDescription: 'Returns the newly created user',
    unauthorized: true,
    badRequest: true,
    badRequestDescription: `If the inputModel has incorrect values.

*Note: If the error should be in the BLL, for example, "the email address is not unique", do not try to mix this error with input validation errors in the middleware, just return one element in the errors array*`,
  });
}
