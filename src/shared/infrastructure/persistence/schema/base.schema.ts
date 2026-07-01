import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserSchemaClass } from './user.schema';

export class BaseSchemaClass {
  @Prop({ type: Date, default: null })
  deleted_at: Date | null;

  @Prop({ type: Boolean, default: false })
  is_deleted: boolean;

  @Prop({ type: Types.ObjectId, required: true, ref: UserSchemaClass.name })
  created_by: Types.ObjectId;
}
