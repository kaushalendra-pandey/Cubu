import { ResolverMap } from "../../../types/graphql-utils";
import { Listing } from "../../../entities/Listing";
import { Brackets, getConnection } from "typeorm";

export const resolvers: ResolverMap = {
  Query: {
    searchListings: async (
      _,
      { model, year, price, make, latitude, longitude, limit, offset }
    ) => {
      let listingQB = getConnection()
        .getRepository(Listing)
        .createQueryBuilder(`list`);
      if (latitude && longitude) {
        listingQB = listingQB.where(new Brackets(sqb => {
          sqb.where(`list.latitude BETWEEN :beginLat AND :endLat`,
            { beginLat: latitude - 1, endLat: latitude + 1 })
            .andWhere(`list.longitude BETWEEN :beginLong AND :endLong`,
              { beginLong: longitude - 1, endLong: longitude + 1 })
        }))
      }
      if (year) {
        listingQB = listingQB.andWhere("list.year = :year", { year });
      }
      if (price) {
        listingQB = listingQB.andWhere("list.price = :price", { price });
      }
      if (model) {
        listingQB = listingQB.andWhere(`list.model ilike :model`, {
          model: `%${model}%`
        });
      }
      if (make) {
        listingQB = listingQB.andWhere(`list.make ilike :make`, {
          make: `%${make}%`
        });
      }

      return listingQB
        .take(limit)
        .skip(offset)
        .getMany();
    }
  }
};
