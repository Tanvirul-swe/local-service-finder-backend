import { HttpStatus } from '@src/constants/httpStatus';
import db from '@src/database/models';
import {
  TCreateUserInput,
  TUpdateUserInput,
  TUser,
} from '@src/database/models/User.model';
import { ApiError } from '@src/utils/ApiError';
import { passwordHash } from '@src/utils/hashing';
import logger from '@src/utils/logger';

/**
 * Creates a new user with the provided input data.
 * Hashes the user's password before saving to the database.
 * Returns the created user object without the password field.
 *
 * @param input - The user data required to create a new user.
 * @returns A promise that resolves to the created user object, excluding the password.
 */
export const createUser = async (
  input: TCreateUserInput,
): Promise<Omit<TUser, 'password'>> => {
  input.password = await passwordHash(input.password);
  logger.info('====Request data: ', input);
  if (input && input.email) {
    const existingUser = await db.User.findOne({
      where: { email: input.email.trim() },
    });
    if (existingUser) {
      throw new ApiError('Email already exists', HttpStatus.BAD_REQUEST);
    }
  }
  const user = await db.User.create(input);

  if (!user) {
    throw new ApiError(
      'User creation failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = user.dataValues;
  return userWithoutPassword;
};

/**
 * Retrieves a user by their unique identifier, excluding the password field from the result.
 *
 * @param userId - The unique identifier of the user to retrieve.
 * @returns A promise that resolves to the user object without the password field, or null if the user is not found.
 */
export const getUserById = async (
  userId: number,
): Promise<Omit<TUser, 'password'> & {
  packages?: any[],
  portfolios?: any[],
  certifications?: any[],
  requestModifications?: any[],
  serviceRequestsAsProvider?: any[]
} | null> => {
  const user = await db.User.findByPk(userId, {
    attributes: { exclude: ['password'] }, // exclude password
    include: [
      { model: db.Package, as: 'packages' },
      { model: db.Portfolio, as: 'portfolios' },
      { model: db.Certification, as: 'certifications' },
      { model: db.RequestModification, as: 'requestModifications' },
      { model: db.ServiceRequest, as: 'serviceRequestsAsProvider' },
    ],
  });

  return user ? user.get({ plain: true }) : null;
};

/**
 * Retrieves a user by their email address, excluding the password field from the result.
 *
 * @param email - The email address of the user to retrieve.
 * @returns A promise that resolves to the user object without the password field, or null if no user is found.
 */
export const getUserByEmail = async (
  email: string,
): Promise<Omit<TUser, 'password'> | null> => {
  const user = await db.User.findOne({ where: { email: email.trim() } });
  return user ? user.dataValues : null;
};

export const updateUser = async (
  userId: number,
  input: TUpdateUserInput,
): Promise<Omit<TUser, 'password'> | null> => {
  if (input.password) {
    input.password = await passwordHash(input.password);
  }

  if (input && input.email) {
    const findUser = await db.User.findOne({
      where: { email: input.email.trim() },
    });
    const existingUser = findUser?.dataValues;
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ApiError('Email already exists', HttpStatus.BAD_REQUEST);
    }
  }

  const user = await db.User.update(input, {
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError('User not found', HttpStatus.NOT_FOUND);
  }

  const findUser = await getUserById(userId);

  return findUser;
};

