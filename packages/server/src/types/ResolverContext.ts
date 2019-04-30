import { PubSub } from "apollo-server";

export interface UserData {
  name: string;
  address: string;
}

export interface ResolverContext {
  userData?: UserData;
  pubSub: PubSub;
}
