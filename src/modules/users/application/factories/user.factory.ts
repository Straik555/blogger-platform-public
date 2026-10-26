import { Injectable } from '@nestjs/common';

import { BcryptService } from '../../../../core/services/bcrypt.service';
import { Login } from '../../../../core/value-objects';
import { User } from '../../domain/user.entity';
import { Email } from '../../domain/value-objects/email';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UsersUniquenessValidator } from '../validators/users-uniqueness.validator';

@Injectable()
export class UserFactory {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly usersUniquenessValidator: UsersUniquenessValidator,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const email = Email.create(dto.email);
    const login = Login.create(dto.login);
    await this.usersUniquenessValidator.checkOrFail(login, email);
    const passwordHash: string = await this.bcryptService.generateHash(
      dto.password,
    );

    return User.createUser({
      login: login.value,
      email: email.value,
      passwordHash,
    });
  }
}
