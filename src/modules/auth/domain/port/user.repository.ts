import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(
    user: Pick<User, 'email' | 'password' | 'twoFactorEnabled'>,
  ): Promise<User>;
}

export const USER_REPOSITORY_TOKEN = Symbol('USER_REPOSITORY');
