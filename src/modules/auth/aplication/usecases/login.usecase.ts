import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

import { SessionsExternalService } from '../../../sessions/application/external/sessions.external-service';
import { Session } from '../../../sessions/domain/session.entity';
import { UserTokensViewDto } from '../../api/view-dto/user-tokens.view-dto';
import {
  ACCESS_TOKEN_STRATEGY,
  REFRESH_TOKEN_STRATEGY,
} from '../../constants/auth-token.inject-constants';

export class LoginCommand {
  constructor(
    public userId: string,
    public ip: string,
    public deviceName: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY)
    private readonly accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY)
    private readonly refreshTokenContext: JwtService,
    private readonly sessionsExternalService: SessionsExternalService,
  ) {}

  async execute({
    userId,
    ip,
    deviceName,
  }: LoginCommand): Promise<UserTokensViewDto> {
    const deviceId = randomUUID();
    const accessToken = this.accessTokenContext.sign({ userId });
    const refreshToken = this.refreshTokenContext.sign({
      userId,
      deviceId,
    });

    const decoded = this.refreshTokenContext.decode<{
      exp: number;
      iat: number;
    }>(refreshToken);

    const newSession = Session.createSession({
      userId,
      deviceName,
      deviceId,
      ip,
      expirationDate: new Date(decoded.exp * 1000),
      updatedAt: new Date(decoded.iat * 1000),
    });
    await this.sessionsExternalService.create(newSession);

    return {
      accessToken,
      refreshToken,
    };
  }
}
