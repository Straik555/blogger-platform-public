import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { EmailConfirmation } from '../domain/email-confirmation.entity';

@Injectable()
export class EmailConfirmationRepository {
  constructor(
    @InjectRepository(EmailConfirmation)
    private readonly emailRepository: Repository<EmailConfirmation>,
  ) {}

  async create(
    emailConfirmation: EmailConfirmation,
    manager: EntityManager = this.emailRepository.manager,
  ): Promise<EmailConfirmation> {
    await manager.getRepository(EmailConfirmation).insert(emailConfirmation);
    return emailConfirmation;
  }

  async update(
    emailConfirmation: EmailConfirmation,
    manager: EntityManager = this.emailRepository.manager,
  ): Promise<void> {
    await manager.getRepository(EmailConfirmation).update(
      { userId: emailConfirmation.userId },
      {
        expirationDate: emailConfirmation.expirationDate,
        confirmationCode: emailConfirmation.confirmationCode,
        isConfirmed: emailConfirmation.isConfirmed,
      },
    );
  }

  async findByUserId(userId: string): Promise<EmailConfirmation | null> {
    return this.emailRepository.findOne({
      where: { userId },
    });
  }
}
