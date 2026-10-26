export class RefreshTokenContextDto {
  constructor(
    public userId: string,
    public deviceId: string,
    public iat: number,
  ) {}
}
