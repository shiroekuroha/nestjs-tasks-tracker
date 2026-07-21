import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetProjectMemberDto {
  @Expose()
  @IsNumber()
  projectId!: number;

  @Expose()
  @IsNumber()
  memberId!: number;

  @Expose()
  @IsNumber()
  roleId?: number;
}
