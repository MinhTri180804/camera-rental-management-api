import { User } from '@modules/auth/domain/entities/user.entity';
import { UserDocument } from '../schema/user.schema';

export class UserMapper {
  static toDomain(user: UserDocument): User {
    const entity = new User();
    entity.id = user._id;
    entity.email = user.email;
    entity.password = user.password;
    entity.twoFactorEnabled = user.two_factor_enabled;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }

  static toPersistence(
    entity: Pick<User, 'email' | 'password' | 'twoFactorEnabled'>,
  ): Partial<UserDocument> {
    const document: Partial<UserDocument> = {
      email: entity.email,
      password: entity.password,
    };

    if (entity.twoFactorEnabled) {
      document.two_factor_enabled = entity.twoFactorEnabled;
    }

    return document;
  }
}
