import { Injectable } from '@nestjs/common';
import { ProfileDocument, ProfileSchemaModel } from '@shared/infrastructure';
import { Model, Types } from 'mongoose';
import { Profile } from '../domain/entities';
import { IProfileRepository } from '../domain/ports';
import { ProfileMapper } from './profile.mapper';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProfileRepositoryIml implements IProfileRepository {
  constructor(
    @InjectModel(ProfileSchemaModel.name)
    private readonly _profileModel: Model<ProfileDocument>,
  ) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await this._profileModel.findOne({ user_id: userId });
    if (!profile) return null;
    return ProfileMapper.toDomain(profile);
  }

  async create(
    profile: Pick<
      Profile,
      'firstName' | 'lastName' | 'avatarPublicId' | 'avatarUrl' | 'userId'
    >,
  ): Promise<Profile> {
    const profileDoc = ProfileMapper.toPersistence(profile);
    const createdProfile = await this._profileModel.create(profileDoc);
    return ProfileMapper.toDomain(createdProfile);
  }

  async update(
    profile: Pick<Profile, 'firstName' | 'lastName' | 'id'>,
  ): Promise<Profile | null> {
    const profileDoc = await this._profileModel.findById(profile.id);
    if (!profileDoc) return null;
    profileDoc.first_name = profile.firstName;
    profileDoc.last_name = profile.lastName;
    await profileDoc.save();
    return ProfileMapper.toDomain(profileDoc);
  }

  async updateAvatar(
    avatar: Pick<Profile, 'avatarPublicId' | 'avatarUrl' | 'id'>,
  ): Promise<Profile | null> {
    const profileDoc = await this._profileModel.findById(avatar.id);
    if (!profileDoc) return null;
    profileDoc.avatar_public_id = avatar.avatarPublicId;
    profileDoc.avatar_url = avatar.avatarUrl;
    await profileDoc.save();
    return ProfileMapper.toDomain(profileDoc);
  }

  async profileByUserIdIsExist(userId: string): Promise<boolean> {
    const profile = await this._profileModel.exists({
      user_id: new Types.ObjectId(userId),
    });
    return !!profile;
  }
}
