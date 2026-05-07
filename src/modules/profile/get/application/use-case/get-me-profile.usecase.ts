import {
  type IProfileRepository,
  PROFILE_REPOSITORY_TOKEN,
} from '@modules/profile/shared/domain/ports';
import { ProfileNotFoundException } from '@modules/profile/shared/presentation/exceptions';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = { userId: string };

@Injectable()
export class GetMeProfileUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY_TOKEN)
    private readonly _profileRepository: IProfileRepository,
  ) {}

  async execute({ userId }: ExecuteParams) {
    const profile = await this._profileRepository.findByUserId(userId);

    if (!profile) throw new ProfileNotFoundException();

    return profile;
  }
}
