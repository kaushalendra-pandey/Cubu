import { withFilter } from 'graphql-subscriptions';
import { NEW_MESSAGE } from '../../shared/constants';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers = {
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(NEW_MESSAGE),
                (payload, variables) => {
                    return payload.newMessage.listingId === variables.listingId;
                },
            ),
        }
    },
};