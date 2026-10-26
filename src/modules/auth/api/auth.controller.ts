import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SkipThrottle } from '@nestjs/throttler';
import { type Request, type Response } from 'express';

import { FieldNames } from '../../../core/constants/field-names.constant';
import { ApiConfirmRegistration } from '../../../core/decorators/swagger/auth/api-confirm-registration.decorator';
import { ApiLogin } from '../../../core/decorators/swagger/auth/api-login.decorator';
import { ApiLogoutDecorator } from '../../../core/decorators/swagger/auth/api-logout.decorator';
import { ApiMe } from '../../../core/decorators/swagger/auth/api-me.decorator';
import { ApiPasswordRecovery } from '../../../core/decorators/swagger/auth/api-password-recovery.decorator';
import { ApiRefreshTokenDecorator } from '../../../core/decorators/swagger/auth/api-refresh-token.decorator';
import { ApiRegistration } from '../../../core/decorators/swagger/auth/api-registration.decorator';
import { ApiRegistrationEmailResendingDecorator } from '../../../core/decorators/swagger/auth/api-registration-email-resending.decorator';
import { ApiUpdatePassword } from '../../../core/decorators/swagger/auth/api-update-password.decorator';
import { CustomThrottlerGuard } from '../../../core/guards/custom-throttler.guard';
import { getDeviceNameUtils } from '../../../core/helpers/get-device-name.helper';
import { ROUTER_PATH } from '../../../core/path/router.path';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { MeLoginQuery } from '../aplication/queries/me-login.query';
import { ConfirmRegistrationCommand } from '../aplication/usecases/confirm-registration.usecase';
import { LoginCommand } from '../aplication/usecases/login.usecase';
import { LogoutCommand } from '../aplication/usecases/logout.usecase';
import { RefreshTokenCommand } from '../aplication/usecases/refresh-token.usecase';
import { RegistrationCommand } from '../aplication/usecases/registration.usecase';
import { ResendConfirmationCodeCommand } from '../aplication/usecases/resend-confirmation-code.usecase';
import { UpdatePasswordCommand } from '../aplication/usecases/update-password.usecase';
import { UpdateRecoveryCodeCommand } from '../aplication/usecases/update-recovery-code.usecase';
import { ConfirmRegistrationDto } from '../dto/confirm-registration.dto';
import { PasswordRecoveryDto } from '../dto/password-recovery.dto';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../guards/decorators/params/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh/jwt-refresh-auth.guard';
import { RefreshTokenContextDto } from '../guards/jwt-refresh/refresh-token-context.dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { UserAccessTokenViewDto } from './view-dto/access-token.view-dto';
import { UserMeViewDto } from './view-dto/user-me.view-dto';
import { UserTokensViewDto } from './view-dto/user-tokens.view-dto';

@UseGuards(CustomThrottlerGuard)
@Controller()
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiLogin()
  @UseGuards(LocalAuthGuard)
  @Post(ROUTER_PATH.auth.login)
  @HttpCode(HttpStatus.OK)
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @Ip() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserAccessTokenViewDto> {
    const deviceName = getDeviceNameUtils(req);
    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginCommand,
      UserTokensViewDto
    >(new LoginCommand(user.id.toString(), ip, deviceName));
    res.cookie(FieldNames.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @ApiRefreshTokenDecorator()
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(ROUTER_PATH.auth.refreshToken)
  async refreshToken(
    @ExtractUserFromRequest() user: Omit<RefreshTokenContextDto, 'iat'>,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const { refreshToken, accessToken } = await this.commandBus.execute<
      RefreshTokenCommand,
      UserTokensViewDto
    >(
      new RefreshTokenCommand({
        ip,
        deviceId: user.deviceId,
        userId: user.userId,
      }),
    );
    res.cookie(FieldNames.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return {
      accessToken,
    };
  }

  @ApiLogoutDecorator()
  @UseGuards(JwtRefreshAuthGuard)
  @Post(ROUTER_PATH.auth.logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logOut(
    @ExtractUserFromRequest() user: Omit<RefreshTokenContextDto, 'iat'>,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie(FieldNames.REFRESH_TOKEN, {
      path: '/',
      secure: true,
      httpOnly: true,
    });
    await this.commandBus.execute(
      new LogoutCommand(user.userId, user.deviceId),
    );
  }

  @ApiMe()
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get(ROUTER_PATH.auth.me)
  async me(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<UserMeViewDto> {
    return await this.queryBus.execute(new MeLoginQuery(user.id));
  }

  @ApiRegistration()
  @Post(ROUTER_PATH.auth.registration)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: CreateUserDto): Promise<void> {
    return await this.commandBus.execute(new RegistrationCommand(body));
  }

  @ApiConfirmRegistration()
  @Post(ROUTER_PATH.auth.registrationConfirmation)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() body: ConfirmRegistrationDto,
  ): Promise<void> {
    return await this.commandBus.execute(new ConfirmRegistrationCommand(body));
  }

  @ApiRegistrationEmailResendingDecorator()
  @Post(ROUTER_PATH.auth.registrationEmailResending)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() body: RegistrationEmailResendingDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new ResendConfirmationCodeCommand(body.email),
    );
  }

  @ApiPasswordRecovery()
  @Post(ROUTER_PATH.auth.passwordRecovery)
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: PasswordRecoveryDto): Promise<void> {
    return await this.commandBus.execute(
      new UpdateRecoveryCodeCommand(body.email),
    );
  }

  @ApiUpdatePassword()
  @Post(ROUTER_PATH.auth.newPassword)
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: UpdatePasswordDto): Promise<void> {
    return await this.commandBus.execute(new UpdatePasswordCommand(body));
  }
}
