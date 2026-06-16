import { Prop } from '@nestjs/mongoose';

export class BaseSchemaClass {
  @Prop({ type: Date, default: null })
  deleted_at: Date | null;

  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;
}
