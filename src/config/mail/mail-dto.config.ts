import { IsString } from 'class-validator';

export class MailConfigDTO {
  @IsString()
  emailFrom: string;
}
