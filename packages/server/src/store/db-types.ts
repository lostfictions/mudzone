import { Entity } from "../generated/graphql";
import { FilterProperties } from "../util/filter-properties";

// these types represent models retrieved from the database, rather than those
// exposed to clients. the models can thus contain both private data and
// unresolved references to other objects.

export interface EntityDbObject
  extends FilterProperties<Entity, { room: any }> {
  room: string;
}
