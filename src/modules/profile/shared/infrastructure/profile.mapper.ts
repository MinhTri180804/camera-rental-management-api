import { ProfileDocument } from '@shared/infrastructure';
import { Profile } from '../domain/entities';
import { Types } from 'mongoose';

export class ProfileMapper {
  static toDomain(profile: ProfileDocument): Profile {
    const entity = new Profile();
    entity.id = profile._id.toString();
    entity.firstName = profile.first_name;
    entity.lastName = profile.last_name;
    entity.createdAt = profile.created_at;
    entity.updatedAt = profile.updated_at;
    entity.avatar = profile.avatar
      ? {
          public_id: profile.avatar.public_id,
          version: profile.avatar.version,
        }
      : null;

    return entity;
  }

  static toPersistence(
    profile: Partial<
      Pick<Profile, 'firstName' | 'lastName' | 'avatar' | 'userId'>
    >,
  ): Partial<ProfileDocument> {
    const document: Partial<ProfileDocument> = {
      user_id: new Types.ObjectId(profile.userId),
      first_name: profile.firstName,
      last_name: profile.lastName,
    };

    if (profile.avatar) {
      document.avatar = {
        public_id: profile.avatar.public_id,
        version: profile.avatar.version,
      };
    }

    return document;
  }
}
