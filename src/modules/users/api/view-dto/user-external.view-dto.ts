import { User } from '../../domain/user.entity';

export class UserExternalViewDto {
  id: string;
  login: string;

  static mapToExternal(user: User): UserExternalViewDto {
    const dto = new UserExternalViewDto();
    dto.id = user.id;
    dto.login = user.login;
    return dto;
  }
}
