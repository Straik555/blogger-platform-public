import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ApiDeleteAllData } from '../../core/decorators/swagger/testing/api-delete-all-data.decorator';
import { ROUTER_PATH } from '../../core/path/router.path';

@Controller(ROUTER_PATH.testing)
export class TestingController {
  constructor(private readonly dataSource: DataSource) {}

  @ApiDeleteAllData()
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    const sqlTables = [
      'recovery_passwords',
      'email_confirmations',
      'users',
      'posts',
      'blogs',
      'post_likes',
      'sessions',
      'comments',
      'comment_likes',
    ];
    const sqlPromise = this.dataSource.query(
      `TRUNCATE TABLE ${sqlTables.join(', ')} CASCADE`,
    );

    await Promise.all([sqlPromise]);

    return {
      status: 'succeeded',
    };
  }
}
