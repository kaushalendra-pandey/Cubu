import { ResolverMap } from "../../../types/graphql-utils";
import { Listing } from "../../../entities/Listing";

export const resolvers: ResolverMap = {
  Query: {
    viewListing: async (_, { id }) => {
      return Listing.findOne({ where: { id } });
    }
  }
};
