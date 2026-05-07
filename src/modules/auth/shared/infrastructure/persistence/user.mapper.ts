import { User } from '@modules/auth/shared/domain/entities';
import { UserDocument } from '@shared/infrastructure/persistence';

export class UserMapper {
  static toDomain(user: UserDocument): User {
    const entity = new User();
    entity.id = user._id.toString();
    entity.email = user.email;
    entity.password = user.password;
    entity.twoFactorEnabled = user.two_factor_enabled;
    entity.createdAt = user.created_at;
    entity.updatedAt = user.updated_at;
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
