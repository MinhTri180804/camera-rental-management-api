import {
  type IProfileRepository,
  PROFILE_REPOSITORY_TOKEN,
} from '@modules/profile/shared/domain/ports';
import { ProfileNotFoundException } from '@modules/profile/shared/presentation/exceptions';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = { userId: string };

@Injectable()
export class DeleteAvatarUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY_TOKEN)
    private readonly _profileRepository: IProfileRepository,
  ) {}

  async execute({ userId }: ExecuteParams) {
    const newProfile =
      await this._profileRepository.deleteAvatarByUserId(userId);

    if (!newProfile) throw new ProfileNotFoundException();

    return newProfile;
  }
}
