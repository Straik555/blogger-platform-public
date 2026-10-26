import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, IsNull, Repository } from 'typeorm';

import { EmailConfirmation } from '../domain/email-confirmation.entity';
import { User } from '../domain/user.entity';
import { UserByUniqueType } from './user-by-unique.type';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    user: User,
    manager: EntityManager = this.userRepository.manager,
  ): Promise<User> {
    await manager.getRepository(User).insert(user);
    return user;
  }

  async update(
    user: User,
    manager: EntityManager = this.userRepository.manager,
  ): Promise<void> {
    await manager.getRepository(User).update(
      { id: user.id },
      {
        login: user.login,
        email: user.email,
        passwordHash: user.passwordHash,
        deletedAt: user.deletedAt,
      },
    );
  }

  async findById(
    userId: string,
    manager: EntityManager = this.userRepository.manager,
  ): Promise<User | null> {
    return manager
      .getRepository(User)
      .findOne({ where: { id: userId, deletedAt: IsNull() } });
  }

  async findUserByCode(code: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('u')
      .innerJoin(EmailConfirmation, 'ec', 'ec.userId = u.id')
      .where('ec.confirmationCode = :code', { code })
      .andWhere('u.deletedAt IS NULL')
      .getOne();
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }
  async findByUnique(
    loginOrEmail: string,
    field: UserByUniqueType,
  ): Promise<User[]> {
    const where: FindOptionsWhere<User> = {
      [field]: loginOrEmail,
      deletedAt: IsNull(),
    };
    return this.userRepository.find({ where });
  }
  async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [
        { login: loginOrEmail, deletedAt: IsNull() },
        { email: loginOrEmail, deletedAt: IsNull() },
      ],
    });
  }
}
