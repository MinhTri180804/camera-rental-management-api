import { Inject, Injectable } from '@nestjs/common';
import { comparePassword } from '@common/utils/hash-password.util';
import {
  type IJwtService,
  type IUserRepository,
  JWT_SERVICE_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain';
import { LoginDTO } from '../dto';
import {
  DUMP_PASSWORD_HASHED,
  EmailOrPasswordInvalidException,
} from '@modules/auth/shared/presentation';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly _userRepository: IUserRepository,

    @Inject(JWT_SERVICE_TOKEN)
    private readonly _jwtService: IJwtService,
  ) {}

  async execute(dto: LoginDTO) {
    const user = await this._userRepository.findByEmail(dto.email);
    const hashPassword = user?.password ?? DUMP_PASSWORD_HASHED;

    const isMatchPassword = await comparePassword(dto.password, hashPassword);

    if (!isMatchPassword || !user) {
      throw new EmailOrPasswordInvalidException();
    }

    const accessToken = this._jwtService.signAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = this._jwtService.signRefreshToken({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
