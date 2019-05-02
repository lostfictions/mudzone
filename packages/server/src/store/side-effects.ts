import { Store } from "./store";
import pubSub from "../pub-sub";

import { resolvers as messageResolvers } from "../types/messages";
import { ENTITY_MOVE } from "../types/entities";

export function initSideEffects(store: Store) {
  const timers = [
    setInterval(() => {
      const context = {
        userData: {
          name: "server"
        },
        store
      };

      const { sendMessage } = messageResolvers.Mutation!;

      (sendMessage as any)(
        {},
        {
          message: `hi from the server ${new Date().getSeconds()}`,
          channel: "default"
        },
        context
      );
    }, 5000),
    setInterval(() => {
      const npc = store.db.getCollection("entities").by("id", "npc")!;
      const { x, y } = npc.position;

      const { width, height } = store.db
        .getCollection("rooms")
        .by("id", npc.room)!;

      const direction = Math.random();

      let deltaX = 0;
      let deltaY = 0;

      /* eslint-disable no-fallthrough */
      switch (true) {
        case direction < 0.25:
          if (x < width) {
            deltaX = 1;
            break;
          }
        case direction < 0.5:
          if (y > 0) {
            deltaY = -1;
            break;
          }
        case direction < 0.75:
          if (x > 0) {
            deltaX = -1;
            break;
          }
        case direction < 1:
          if (y < height) {
            deltaY = 1;
          }
      }
      /* eslint-enable no-fallthrough */

      if (deltaX === 0 && deltaY === 0) {
        return;
      }

      npc.position = {
        x: x + deltaX,
        y: y + deltaY
      };

      store.db.getCollection("entities").update(npc);

      pubSub.publish(ENTITY_MOVE, npc);
    }, 900)
  ];

  return () => {
    timers.forEach(clearInterval);
  };
}
