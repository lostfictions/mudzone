import { Entity } from "../generated/graphql";
import { FilterProperties } from "../util/filter-properties";

export interface EntityDbObject
  extends FilterProperties<Entity, { room: any }> {
  room: string;
}
