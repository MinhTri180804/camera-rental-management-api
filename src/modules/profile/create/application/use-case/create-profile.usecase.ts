import { Inject, Injectable } from '@nestjs/common';
import { CreateProfileDTO } from '../dto/create.dto';
import {
  type IProfileRepository,
  PROFILE_REPOSITORY_TOKEN,
} from '@modules/profile/shared/domain/ports';
import { ProfileIsExistsException } from '../../presentation/exceptions';

type ExecuteParams = { userId: string } & CreateProfileDTO;

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY_TOKEN)
    private readonly _profileRepository: IProfileRepository,
  ) {}
  async execute(data: ExecuteParams) {
    const profileIsExist = await this._profileRepository.profileByUserIdIsExist(
      data.userId,
    );

    if (profileIsExist) {
      throw new ProfileIsExistsException();
    }

    const profile = await this._profileRepository.create({
      avatarPublicId: data.avatarPublicId || null,
      avatarUrl: data.avatarUrl || null,
      firstName: data.firstName,
      lastName: data.lastName,
      userId: data.userId,
    });
    return profile;
  }
}
