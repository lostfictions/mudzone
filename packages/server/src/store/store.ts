import { RxCollection } from "rxdb";
import { distinctUntilChanged, scan, groupBy, flatMap } from "rxjs/operators";
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
import { ROOM_CHANGED } from "../gql/rooms";

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
      groupBy(ev => ev.data.v.id),
      // HACK: should be able to infer but it's getting confused
      flatMap(group$ =>
        group$.pipe(
          distinctUntilChanged<RxChangeEventUpdate<EntityDbObject>, Position>(
            (pos, prev) => pos.x === prev.x && pos.y === prev.y,
            ev => ev.data.v.position
          )
        )
      )
    )
    .subscribe(ev => pubSub.publish(ENTITY_MOVE, ev.data.v));

  store.messages.insert$.subscribe(ev =>
    pubSub.publish(CHAT_MESSAGE, ev.data.v)
  );

  store.rooms.update$
    .pipe(
      groupBy(ev => ev.data.v.id),
      flatMap(group$ =>
        group$.pipe(
          // HACK: should be able to infer but it's getting confused
          distinctUntilChanged<RxChangeEventUpdate<RoomDbObject>, string[]>(
            // comparing length should be ok (famous last words)
            (entities, prev) => entities.length === prev.length,
            ev => ev.data.v.entities
          ),
          scan(
            (acc, curr) => {
              const left = acc.prev.filter(
                id => !curr.data.v.entities.includes(id)
              );
              const joined = curr.data.v.entities.filter(
                id => !acc.prev.includes(id)
              );
              return {
                id: curr.data.v.id,
                prev: curr.data.v.entities,
                left,
                joined
              };
            },
            {
              id: "",
              prev: [] as string[],
              left: [] as string[],
              joined: [] as string[]
            }
          )
        )
      )
    )
    .subscribe(data => {
      const payload = {} as any;
      if (data.left && data.left.length > 0) {
        payload.left = data.left.map(id => ({ id }));
      }
      if (data.joined && data.joined.length > 0) {
        payload.joined = data.joined.map(id => ({ id }));
      }
      if (payload.joined || payload.left) {
        pubSub.publish(ROOM_CHANGED, { id: data.id, roomChanged: payload });
      }
    });

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
      entities: ["npc", "wall"]
    }
  ]);
  await ensureCollection("entities", [
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
