import {
  type IProfileRepository,
  PROFILE_REPOSITORY_TOKEN,
} from '@modules/profile/shared/domain/ports';
import { Inject } from '@nestjs/common';
import { UpdateAvatarDTO } from '../dto';
import { UserIdNotMatchException } from '../../presentation/exceptions';
import { ProfileNotFoundException } from '@modules/profile/shared/presentation/exceptions';

type ExecuteParams = { userId: string } & UpdateAvatarDTO;

export class UpdateAvatarUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY_TOKEN)
    private readonly _profileRepository: IProfileRepository,
  ) {}

  async execute({ userId, ...dto }: ExecuteParams) {
    const userIdPublicId = dto.publicId.split('/')[1];

    if (userId !== userIdPublicId) {
      throw new UserIdNotMatchException();
    }

    const newProfile = await this._profileRepository.updateAvatarByUserId({
      userId,
      avatar: {
        publicId: dto.publicId,
        version: dto.version,
      },
    });

    if (!newProfile) throw new ProfileNotFoundException();

    return newProfile;
  }
}
