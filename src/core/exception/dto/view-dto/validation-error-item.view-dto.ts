import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorItemViewDto {
  @ApiProperty({
    type: String,
    description: 'What field/property of input model has error',
    nullable: true,
    required: false,
  })
  field: string;

  @ApiProperty({
    type: String,
    description: 'Message with error explanation for certain field',
    nullable: true,
    required: false,
  })
  message: string;
}

export class ValidationErrorResponseViewDto {
  @ApiProperty({ type: [ValidationErrorItemViewDto], required: false })
  errorsMessages: ValidationErrorItemViewDto[];
}
