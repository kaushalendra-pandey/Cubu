import { ResolverMap } from "../../../types/graphql-utils";
import { Listing } from "../../../entities/Listing";
import { processUpload } from "../../shared/processUpload";
import { LISTING_CACHE_KEY } from "../../../constants";

export const resolvers: ResolverMap = {
  Mutation: {
    createListing: async (_, { input: { picture, ...data } }, { session, redis }) => {
      const pictureUrl = picture ? await processUpload(picture) : null;

      const listing: any = Listing.create({
        ...data,
        pictureUrl,
        userId: session.userId
      })

      await listing.save();

      redis.lpush(LISTING_CACHE_KEY, JSON.stringify(listing));

      return true;
    }
  }
};
