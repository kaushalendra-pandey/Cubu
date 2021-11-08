require("dotenv-safe").config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { genSchema } from "./utils/genSchema";
import { confirmEmail } from "./routes/confirmEmail";
import { createTestConn } from "./tests/createTestConn";
import { createTypeormConn } from "./utils/createTypeormConn";
import { Listing } from "./entities/Listing";
import { REDIS_SESSION_PREFIX, LISTING_CACHE_KEY, __prod__, COOKIE_NAME } from "./constants";
import { userLoader } from "./loaders/UserLoader";
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import RateLimit from "express-rate-limit";
import RateLimitRedisStore from "rate-limit-redis";
import session from "express-session";

let RedisStore = require('connect-redis')(session)

const startServer = async () => {

  const schema = genSchema() as any;
  const app = express();
  const redis = new Redis(process.env.REDIS_URL);

  if (process.env.NODE_ENV === "test") {
    await redis.flushall();
  }

  const pubsub = new RedisPubSub(
    process.env.NODE_ENV === "production"
      ? {
        connection: process.env.REDIS_URL as any
      }
      : {}
  );
  
  if (process.env.NODE_ENV === "test") {
    await createTestConn(true);
  }
  else {
    await createTypeormConn();
  }

  app.use(
    new RateLimit({
      store: new RateLimitRedisStore({
        client: redis
      }),
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      delayMs: 0 // disable delaying - full speed until the max limit is reached
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        prefix: REDIS_SESSION_PREFIX,
      }),
      cookie: {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        domain: __prod__ ? ".localhost:3000" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SECRET as string,
      resave: false,
    }) as any
  );
  app.get("/confirm/:id", confirmEmail);

  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema: schema,
    context: ({ req, res }) => ({
      redis,
      url: req ? req.protocol + "://" + req.get("host") : '',
      session: req ? req.session : undefined,
      req: req,
      res: res,
      userLoader: userLoader(),
      pubsub: pubsub
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          'request.credentials': 'include',
        }
      }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
      }
    ]
  });

  await server.start();

  const cors = {
    credentials: true,
    origin: process.env.FRONTEND_HOST
  };

  server.applyMiddleware({
    app,
    cors,
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  await redis.del(LISTING_CACHE_KEY);
  const listings = await Listing.find();
  const listingStrings = listings.map(x => JSON.stringify(x));
  if (listingStrings.length) {
    await redis.lpush(LISTING_CACHE_KEY, ...listingStrings);
  }

  const port = process.env.PORT || 4000;

  httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
    console.log(`Subscriptions ready at ws://localhost:${port}${server.graphqlPath}`)
  });
};

startServer().catch((err) => {
  console.error(err);
});