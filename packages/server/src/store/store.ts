import { RxCollection } from "rxdb";
import { distinctUntilChanged } from "rxjs/operators";
import uuid from "uuid/v4";

import pubSub from "../pub-sub";
import RxDB from "./db-config";
import {
  EntityDbObject,
  EntitySchema,
  RoomDbObject,
  RoomSchema,
  MessageSchema
} from "../types/db-types";
import { Message, Position } from "../generated/graphql";
import { ENTITY_MOVE } from "../gql/entities";
import { RxChangeEventUpdate } from "rxdb/typings/rx-change-event";
import { CHAT_MESSAGE } from "../gql/messages";

interface CollectionMap {
  rooms: RoomDbObject;
  entities: EntityDbObject;
  messages: Message;
}

export type Store = {
  [K in keyof CollectionMap]: RxCollection<CollectionMap[K], {}, {}>
};

export async function getStore(storePath: string): Promise<Store> {
  const db = await RxDB.create({
    name: storePath,
    adapter: "memory",
    // queryChangeDetection: true,
    multiInstance: false
  });

  const store: Store = {
    rooms: await db.collection({
      name: "rooms",
      schema: RoomSchema
    }),
    entities: await db.collection({
      name: "entities",
      schema: EntitySchema
    }),
    messages: await db.collection({
      name: "messages",
      schema: MessageSchema
    })
  };

  console.log("DB Loaded");

  // TODO: move
  store.entities.update$
    .pipe(
      // HACK: should be able to infer but it's getting confused
      distinctUntilChanged<RxChangeEventUpdate<EntityDbObject>, Position>(
        (pos, prev) => pos.x === prev.x && pos.y === prev.y,
        ev => ev.data.v.position
      )
    )
    .subscribe(ev => pubSub.publish(ENTITY_MOVE, ev.data.v));

  store.messages.insert$.subscribe(ev =>
    pubSub.publish(CHAT_MESSAGE, ev.data.v)
  );

  const ensureCollection = async <K extends keyof CollectionMap>(
    collectionName: K,
    entries: CollectionMap[K][]
  ) => {
    const collection = store[collectionName];

    await Promise.all(
      entries.map(async e => {
        if (!(await collection.findOne({ id: e.id }).exec())) {
          await collection.insert(e as any);
        }
      })
    );
  };

  await ensureCollection("rooms", [
    {
      id: "default",
      name: "default",
      height: 25,
      width: 30,
      entities: ["npc", "player", "wall"]
    }
  ]);
  await ensureCollection("entities", [
    {
      id: "player",
      name: "Player",
      description: "despite everything, it's still you.",
      room: "default",
      position: { x: 5, y: 5 },
      appearance: "@",
      color: "red"
    },
    {
      id: "npc",
      name: "NPC",
      description: "only slightly funny-smelling.",
      room: "default",
      position: { x: 2, y: 2 },
      appearance: "@",
      color: "blue"
    },
    {
      id: "wall",
      name: "wall",
      description: "thick as a brick.",
      room: "default",
      position: { x: 10, y: 10 },
      appearance: "#",
      color: "#556"
    }
  ]);
  await ensureCollection("messages", [
    {
      id: uuid(),
      time: new Date().toISOString(),
      channel: "default",
      author: "old-server",
      text: "hello from history"
    }
  ]);

  return store;
}
