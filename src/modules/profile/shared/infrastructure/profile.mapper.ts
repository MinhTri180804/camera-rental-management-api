import { ProfileDocument } from '@shared/infrastructure';
import { Profile } from '../domain/entities';
import { Types } from 'mongoose';

export class ProfileMapper {
  static toDomain(profile: ProfileDocument): Profile {
    const entity = new Profile();
    entity.id = profile._id.toString();
    entity.firstName = profile.first_name;
    entity.lastName = profile.last_name;
    entity.avatarPublicId = profile.avatar_public_id;
    entity.avatarUrl = profile.avatar_url;
    entity.createdAt = profile.created_at;
    entity.updatedAt = profile.updated_at;
    return entity;
  }

  static toPersistence(
    profile: Partial<
      Pick<
        Profile,
        'firstName' | 'lastName' | 'avatarPublicId' | 'avatarUrl' | 'userId'
      >
    >,
  ): Partial<ProfileDocument> {
    const document: Partial<ProfileDocument> = {
      user_id: new Types.ObjectId(profile.userId),
      first_name: profile.firstName,
      last_name: profile.lastName,
      avatar_public_id: null,
      avatar_url: null,
    };

    if (profile.avatarPublicId) {
      document.avatar_public_id = profile.avatarPublicId;
    }

    if (profile.avatarUrl) {
      document.avatar_url = profile.avatarUrl;
    }

    return document;
  }
}
