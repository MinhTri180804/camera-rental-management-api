import { Profile } from '../entities';

export interface IProfileRepository {
  findByUserId: (userId: string) => Promise<Profile | null>;

  create: (
    profile: Pick<
      Profile,
      'firstName' | 'lastName' | 'avatarPublicId' | 'avatarUrl' | 'userId'
    >,
  ) => Promise<Profile>;

  update: ({
    userId,
    firstName,
    lastName,
  }: {
    userId: string;
    lastName?: string;
    firstName?: string;
  }) => Promise<Profile | null>;

  updateAvatar: (
    avatar: Pick<Profile, 'avatarPublicId' | 'avatarUrl' | 'id'>,
  ) => Promise<Profile | null>;

  profileByUserIdIsExist: (userId: string) => Promise<boolean>;
}

export const PROFILE_REPOSITORY_TOKEN = Symbol('PROFILE_REPOSITORY_TOKEN');
