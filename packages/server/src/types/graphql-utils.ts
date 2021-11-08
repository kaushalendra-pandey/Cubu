import express from "express";
import * as ExpressSession from "express-session";
import { Redis } from "ioredis";
import { PubSub } from 'graphql-subscriptions';
import { userLoader } from "../loaders/UserLoader";

export interface Session extends ExpressSession.Session {
    userId?: string;
}

export type Context = {
    redis: Redis;
    url: string;
    session: Session;
    req: Express.Request;
    res: express.Response;
    userLoader: ReturnType<typeof userLoader>;
    pubsub: PubSub;
}

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;


export type GraphQLMiddlewareFunc = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver | { [key: string]: Resolver };
    };
}