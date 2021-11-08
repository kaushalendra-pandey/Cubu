import { LISTING_CACHE_KEY } from '../../../constants';
import { ResolverMap } from '../../../types/graphql-utils';

export const resolvers: ResolverMap = {
  Listing: {
    pictureUrl: (parent, _, { url }) => {
      if (!parent.pictureUrl) {
        return parent.pictureUrl;
      }
      if (parent.pictureUrl.includes('http')) {
        return parent.pictureUrl;
      }
      return `${url}/images/${parent.pictureUrl}`;
    },
    owner: ({ userId }, _, { userLoader }) => userLoader.load(userId)
  },
  Query: {
    findListings: async (_, __, { redis }) => {
      const listings = (await redis.lrange(LISTING_CACHE_KEY, 0, -1)) || [];
      return listings.map((x: string) => JSON.parse(x));
    }
  }
};
