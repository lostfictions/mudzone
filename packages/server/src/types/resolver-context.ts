import { PubSub } from "apollo-server";

import { Store } from "../store/store";

export interface UserData {
  name: string;
  address: string;
}

export interface ResolverContext {
  userData?: UserData;
  store: Store;
  pubSub: PubSub;
}
