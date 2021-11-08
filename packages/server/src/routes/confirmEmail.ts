import { Request, Response } from "express";
import { User } from "../entities/User";
import Redis from "ioredis";
const path = require('path');

export const confirmEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const redis = new Redis(process.env.REDIS_URL);
  const userId = await redis.get(id);
  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    await redis.del(id);
    res.sendFile(path.join(__dirname, '/success.html'));
  } else {
    res.sendFile(path.join(__dirname, '/invalid.html'));
  }
};
