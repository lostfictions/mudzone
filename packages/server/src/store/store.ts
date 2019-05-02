import path from "path";

import { readJson, outputJson } from "fs-extra";
// import uuid from "uuid/v4";
import Loki, { Collection } from "lokijs";
// import LokiFsStructuredAdapter from "lokijs/src/loki-fs-structured-adapter";

import { FilterProperties } from "../util/filter-properties";
import { Message, Room } from "../generated/graphql";
import { EntityDbObject } from "./db-types";

interface CollectionMap {
  rooms: Room;
  entities: EntityDbObject;
  messages: Message;
}

interface DB extends FilterProperties<Loki, { getCollection: any }> {
  getCollection<K extends keyof CollectionMap>(
    collectionName: K
  ): Collection<CollectionMap[K]>;
}

interface AppState {
  messageCounter: number;
}

export interface Store {
  appState: AppState;
  db: DB;
}

export async function getStore(storePath: string): Promise<Store> {
  const db = new Loki(path.join(storePath, "loki.db"), {
    autosave: true
  }) as DB;

  await new Promise<void>((res, rej) => {
    db.loadDatabase({}, err => {
      if (err) rej(err);
      res();
    });
  });

  console.log("DB Loaded");

  const ensureCollection = <K extends keyof CollectionMap>(
    collectionName: K,
    entries?: CollectionMap[K][]
  ) => {
    if (!db.getCollection(collectionName)) {
      const collection = db.addCollection(collectionName, {
        unique: ["id"]
      });
      if (entries) collection.insert(entries);
    }
  };

  ensureCollection("rooms", [{ id: "default", height: 25, width: 30 }]);
  ensureCollection("entities", [
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
    }
  ]);
  ensureCollection("messages", [
    {
      id: 0,
      time: new Date(),
      channel: "default",
      author: "old-server",
      text: "hello from history"
    }
  ]);

  let appState: AppState;
  const appStatePath = path.join(storePath, "app-state.json");
  try {
    appState = await readJson(appStatePath);
  } catch (e) {
    console.warn(
      `Can't read serialized app state from ${appStatePath}, reinitializing`
    );

    const initialMessageCounterValue =
      db.getCollection("messages").max("id") + 1;

    console.log(`Initial messageCounter value: ${initialMessageCounterValue}`);

    appState = {
      messageCounter: db.getCollection("messages").max("id") + 1
    };
  }

  setInterval(async () => {
    await outputJson(appStatePath, appState);
    // console.log(`Flushed app state to ${appStatePath}`);
  }, 5000);

  return { appState, db };
}
