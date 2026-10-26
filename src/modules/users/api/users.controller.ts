import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ApiCreateUser } from '../../../core/decorators/swagger/users/api-create-user.decorator';
import { ApiDeleteUserById } from '../../../core/decorators/swagger/users/api-delete-user-by-id.decorator';
import { ApiGetUsersList } from '../../../core/decorators/swagger/users/api-get-users-list.decorator';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BaseAuthGuard } from '../../../core/guards/base-auth.guard';
import { ROUTER_PATH } from '../../../core/path/router.path';
import { UuidValidationPipe } from '../../../core/pipes/uuid-validation.pipe';
import { GetAllUserQuery } from '../application/queries/get-all-user.query';
import { CreateAdminUserCommand } from '../application/usecases/create-admin-user.usecase';
import { DeleteUserCommand } from '../application/usecases/delete-user.usecase';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersQueryParams } from './input-dto/users-query-params.input-dto';
import { UserViewDto } from './view-dto/user.view-dto';

@UseGuards(BaseAuthGuard)
@Controller(ROUTER_PATH.sa + ROUTER_PATH.users)
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiGetUsersList()
  @Get()
  async getUsersList(
    @Query() query: UsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.queryBus.execute(new GetAllUserQuery(query));
  }

  @ApiCreateUser()
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<UserViewDto> {
    return await this.commandBus.execute(new CreateAdminUserCommand(body));
  }

  @ApiDeleteUserById()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', UuidValidationPipe) id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
