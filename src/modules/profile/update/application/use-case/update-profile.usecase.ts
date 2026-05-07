import {
  type IProfileRepository,
  PROFILE_REPOSITORY_TOKEN,
} from '@modules/profile/shared/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { ProfileNotFoundException } from '../../../shared/presentation/exceptions';
import { UpdateProfileDTO } from '../dto';

type ExecuteParams = { userId: string } & UpdateProfileDTO;

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY_TOKEN)
    private readonly _profileRepository: IProfileRepository,
  ) {}
  async execute(data: ExecuteParams) {
    const newProfile = await this._profileRepository.update({
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (!newProfile) throw new ProfileNotFoundException();

    return newProfile;
  }
}
