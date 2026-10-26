import { NewestLikesViewDtoType } from '../../api/view-dto/newest-likes.view-dto';

export class PostNewestLikesRow {
  public updated_at: Date;
  public user_id: string;
  public login: string;

  static mapToRow(data: PostNewestLikesRow): NewestLikesViewDtoType {
    return {
      login: data.login,
      updatedAt: data.updated_at,
      userId: data.user_id,
    };
  }
}
