import { FieldNames } from '../../../constants/field-names.constant';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiDeleteDeviceByIdDecorator() {
  return ApiMutateEntity({
    summary: `Terminate specified device session`,
    noContent: true,
    unauthorized: true,
    notFound: true,
    forbidden: true,
    forbiddenDescription: 'It try delete the deviceId of other user',
    isApiParams: true,
    nameParam: FieldNames.DEVICE_ID,
    descriptionParam: 'Id of session that will be terminated',
  });
}
