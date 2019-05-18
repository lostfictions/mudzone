import { Store } from "../store/store";

export interface UserData {
  id: string;
  name: string;
  address: string;
}

export interface ResolverContext {
  userData?: UserData;
  store: Store;
}
