import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiDeleteDevicesListDecorator() {
  return ApiMutateEntity({
    summary: `Terminate all other (exclude current) device's sessions`,
    noContent: true,
    unauthorized: true,
  });
}
