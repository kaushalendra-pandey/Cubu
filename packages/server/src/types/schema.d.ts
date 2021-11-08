// tslint:disable
// graphql typescript definitions

declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation | ISubscription;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface ICreateListingInput {
    make: string;
    model: string;
    year: number;
    picture?: any | null;
    description: string;
    price: number;
    latitude: number;
    longitude: number;
    features: Array<string>;
  }

  interface IMutation {
    __typename: 'Mutation';
    createListing: boolean;
    deleteListing: boolean;
    updateListing: boolean;
    createMessage: boolean;
    sendForgotPasswordEmail: boolean | null;
    forgotPasswordChange: Array<IError> | null;
    login: ILoginResponse;
    logout: boolean | null;
    register: Array<IError> | null;
  }

  interface ICreateListingOnMutationArguments {
    input: ICreateListingInput;
  }

  interface IDeleteListingOnMutationArguments {
    id: string;
  }

  interface IUpdateListingOnMutationArguments {
    listingId: string;
    input: IUpdateListingInput;
  }

  interface ICreateMessageOnMutationArguments {
    message: IMessageInput;
  }

  interface ISendForgotPasswordEmailOnMutationArguments {
    email: string;
  }

  interface IForgotPasswordChangeOnMutationArguments {
    newPassword: string;
    key: string;
  }

  interface ILoginOnMutationArguments {
    email: string;
    password: string;
  }

  interface IRegisterOnMutationArguments {
    name: string;
    email: string;
    password: string;
  }

  interface IListing {
    __typename: 'Listing';
    id: string;
    make: string;
    model: string;
    year: number;
    pictureUrl: string | null;
    description: string;
    price: number;
    latitude: number;
    longitude: number;
    features: Array<string>;
    owner: IUser;
  }

  interface IQuery {
    __typename: 'Query';
    findListings: Array<IListing>;
    searchListings: Array<IListing>;
    viewListing: IListing | null;
    messages: Array<IMessage>;
    me: IUser | null;
  }

  interface ISearchListingsOnQueryArguments {
    input?: ISearchListingsInput | null;
    offset: number;
    limit: number;
  }

  interface IViewListingOnQueryArguments {
    id: string;
  }

  interface IMessagesOnQueryArguments {
    listingId: string;
  }

  interface ISearchListingsInput {
    year?: number | null;
    price?: number | null;
    model?: string | null;
    make?: string | null;
    description?: string | null;
  }

  interface IUpdateListingInput {
    name?: string | null;
    make?: string | null;
    model?: string | null;
    year?: number | null;
    category?: string | null;
    picture?: any | null;
    description?: string | null;
    price?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    features?: Array<string> | null;
  }

  interface IMessageInput {
    text: string;
    listingId: string;
  }

  interface IMessage {
    __typename: 'Message';
    text: string;
    user: IUser;
    listingId: string;
  }

  interface ISubscription {
    __typename: 'Subscription';
    newMessage: IMessage;
  }

  interface INewMessageOnSubscriptionArguments {
    listingId: string;
  }

  interface ILoginResponse {
    __typename: 'LoginResponse';
    errors: Array<IError> | null;
    sessionId: string | null;
  }

  interface IError {
    __typename: 'Error';
    path: string;
    message: string;
  }

  interface IUser {
    __typename: 'User';
    id: string;
    email: string;
  }
}

// tslint:enable
