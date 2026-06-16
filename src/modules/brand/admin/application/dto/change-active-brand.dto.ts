import { IsBoolean } from 'class-validator';

export class ChangeActiveBrandDTO {
  @IsBoolean()
  isActive: boolean;
}
