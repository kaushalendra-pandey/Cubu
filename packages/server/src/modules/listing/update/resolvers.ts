import { ResolverMap } from "../../../types/graphql-utils";
import { Listing } from "../../../entities/Listing";
import { processUpload } from "../../shared/processUpload";
import { getConnection } from "typeorm";
import { LISTING_CACHE_KEY } from "../../../constants";

export const resolvers: ResolverMap = {
  Mutation: {
    updateListing: async (
      _,
      { listingId, input: { picture, ...data } },
      { redis }
    ) => {
      if (picture) {
        data.pictureUrl = await processUpload(picture);
      }
      const {
        raw: [newListing]
      } = await getConnection()
        .createQueryBuilder()
        .update(Listing)
        .set(data)
        .where("id = :id", { id: listingId })
        .returning("*")
        .execute();

      const listings = await redis.lrange(LISTING_CACHE_KEY, 0, -1);
      const idx = listings.findIndex(
        (x: string) => JSON.parse(x).id === listingId
      );
      await redis.lset(LISTING_CACHE_KEY, idx, JSON.stringify(newListing));

      return true;
    }
  }
};
