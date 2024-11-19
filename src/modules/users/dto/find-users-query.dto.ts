import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/common/enums';
import { BaseQueryDto } from 'src/common/query';

export class FindUsersQuery extends BaseQueryDto {
  @ApiProperty({
    name: 'role',
    description: 'Role of the user',
    required: false,
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
