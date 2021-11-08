import argon2 from 'argon2';

import { ResolverMap } from "../../../types/graphql-utils";
import { User } from "../../../entities/User";
import {
  invalidLogin,
  confirmEmailError,
  forgotPasswordLockedError
} from "./errorMessages";
import { USER_SESSION_PREFIX } from "../../../constants";

const errorResponse = [
  {
    path: "email",
    message: invalidLogin
  }
];

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      _,
      { email, password },
      { session, redis, req }
    ) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return { errors: errorResponse };
      }

      if (!user.confirmed) {
        return {
          errors: [
            {
              path: "email",
              message: confirmEmailError
            }
          ]
        };
      }

      if (user.forgotPasswordLocked) {
        return {
          errors: [
            {
              path: "email",
              message: forgotPasswordLockedError
            }
          ]
        };
      }

      const valid = await argon2.verify(user.password, password);

      if (!valid) {
        return { errors: errorResponse };
      }
      
      session.userId = user.id;

      if (req.sessionID) {
        await redis.lpush(`${USER_SESSION_PREFIX}${user.id}`, req.sessionID);
      }

      return { sessionId: req.sessionID };
    }
  }
};
