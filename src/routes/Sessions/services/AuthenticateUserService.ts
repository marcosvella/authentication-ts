import { getRepository } from 'typeorm';

import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../../../models/Users';

import authConfig from '../../../config/auth';
import AppError from '../../../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface Token {
  secret: string;
  expiresIn: string;
  userId: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const accessToken = generateToken({
      secret: authConfig.jwt.accessToken.secret,
      expiresIn: authConfig.jwt.accessToken.expiresIn,
      userId: user.id,
    });

    const refreshToken = generateToken({
      secret: authConfig.jwt.refreshToken.secret,
      expiresIn: authConfig.jwt.refreshToken.expiresIn,
      userId: user.id,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export default AuthenticateUserService;

function generateToken({ secret, expiresIn, userId }: Token) {
  const token = sign({}, secret, {
    subject: userId,
    expiresIn: expiresIn,
  });

  return token;
}
