import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { SessionsExternalService } from '../../../sessions/application/external/sessions.external-service';
import { UserTokensViewDto } from '../../api/view-dto/user-tokens.view-dto';
import {
  ACCESS_TOKEN_STRATEGY,
  REFRESH_TOKEN_STRATEGY,
} from '../../constants/auth-token.inject-constants';

interface IRefreshTokenCommand {
  userId: string;
  deviceId: string;
  ip: string;
}

export class RefreshTokenCommand {
  public userId: string;
  public deviceId: string;
  public ip: string;
  constructor(dto: IRefreshTokenCommand) {
    Object.assign(this, dto);
  }
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY)
    private readonly accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY)
    private readonly refreshTokenContext: JwtService,
    private readonly sessionsExternalService: SessionsExternalService,
  ) {}

  async execute({
    userId,
    deviceId,
    ip,
  }: RefreshTokenCommand): Promise<UserTokensViewDto> {
    const session = await this.sessionsExternalService.findSessionOrThrow(
      userId,
      deviceId,
    );
    const accessToken = this.accessTokenContext.sign({ userId });
    const refreshToken = this.refreshTokenContext.sign({
      userId,
      deviceId,
    });

    const decoded = this.refreshTokenContext.decode<{
      exp: number;
      iat: number;
    }>(refreshToken);

    session.updateExpirationDateAndIp(
      new Date(decoded.exp * 1000),
      ip,
      new Date(decoded.iat * 1000),
    );
    await this.sessionsExternalService.update(session);

    return {
      accessToken,
      refreshToken,
    };
  }
}
