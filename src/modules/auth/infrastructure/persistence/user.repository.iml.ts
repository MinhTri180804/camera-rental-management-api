import { User } from '@modules/auth/domain/entities/user.entity';
import { IUserRepository } from '@modules/auth/domain/port/user.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserMapper } from '@shared/infrastructure/persistence/mapper/user.mapper';
import {
  UserDocument,
  UserSchemaClass,
} from '@shared/infrastructure/persistence/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly _userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this._userModel.findOne({ email });
    if (!user) return null;
    return UserMapper.toDomain(user);
  }

  async create(
    user: Pick<User, 'email' | 'password' | 'twoFactorEnabled'>,
  ): Promise<User> {
    const userDocument = UserMapper.toPersistence(user);
    const createdUser = await this._userModel.create(userDocument);
    return UserMapper.toDomain(createdUser);
  }
}
