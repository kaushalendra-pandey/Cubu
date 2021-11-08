import { Redis } from "ioredis";
import { removeAllUsersSessions } from "./removeAllUsersSessions";
import { User } from "../entities/User";

export const forgotPasswordLockAccount = async (
  userId: string,
  redis: Redis
) => {
  // can't login
  await User.update({ id: userId }, { forgotPasswordLocked: true });
  // remove all sessions
  await removeAllUsersSessions(userId, redis);
};
