import { CreateUserDto } from '../../../../modules/users/dto/create-user.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiRegistration() {
  return ApiMutateEntity({
    summary:
      'Registration in the system. Email with confirmation code will be send to passed email address',
    bodyType: CreateUserDto,
    noContentDescription:
      'Input data is accepted. Email with confirmation code will be send to passed email address',
    badRequest: true,
    badRequestDescription:
      'If the inputModel has incorrect values (in particular if the user with the given email or login already exists)',
    tooManyRequests: true,
  });
}
