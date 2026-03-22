import { Types } from 'mongoose';

export class User {
  id: Types.ObjectId;
  email: string;
  password: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
