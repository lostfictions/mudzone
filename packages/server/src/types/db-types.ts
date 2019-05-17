import merge from "lodash.merge";
import { RxDocument } from "rxdb";

import { FilterProperties } from "../util/filter-properties";

import { Entity, Room } from "../generated/graphql";

// FIXME: this is a tower of cards but ok

// these types represent models retrieved from the database, rather than those
// exposed to clients. the models can thus contain both private data and
// unresolved references to other objects.
export interface EntityDbObject
  extends FilterProperties<Entity, { room: any }> {
  room: string;
}
export type EntityDoc = RxDocument<EntityDbObject>;

export interface RoomDbObject
  extends FilterProperties<Room, { entities: any }> {
  entities: string[];
}
export type RoomDoc = RxDocument<RoomDbObject>;

import EntitySchemaJson from "../../schemas/entity-db-object.json";
import MessageSchemaJson from "../../schemas/message.json";
import RoomSchemaJson from "../../schemas/room-db-object.json";

export const EntitySchema = merge(
  {
    title: "Entity",
    version: 0,
    properties: { id: { primary: true }, room: { ref: "rooms" } }
  },
  EntitySchemaJson
);

export const RoomSchema = merge(
  {
    title: "Room",
    version: 0,
    properties: {
      id: { primary: true },
      entities: {
        uniqueItems: true,
        ref: "entities"
      }
    }
  },
  RoomSchemaJson
);

export const MessageSchema = merge(
  {
    title: "Message",
    version: 0,
    properties: { id: { primary: true } }
  },
  MessageSchemaJson
);
