import { Store } from "./store";

import { resolvers as messageResolvers } from "../gql/messages";
import { ResolverContext } from "../types/resolver-context";
import { Room } from "../generated/graphql";

export function initSideEffects(store: Store) {
  const timers = [
    setInterval(() => {
      const context: ResolverContext = {
        userData: {
          name: "server",
          address: "here"
        },
        store
      };

      const { sendMessage } = messageResolvers.Mutation!;

      sendMessage!(
        {},
        {
          message: `hi from the server ${new Date().getSeconds()}`,
          channel: "default"
        },
        context,
        undefined as any
      );
    }, 5000),
    setInterval(async () => {
      const npc = (await store.entities
        .findOne({ id: { $eq: "npc" } })
        .exec())!;

      const { x, y } = npc.position;

      const { width, height } = (await npc.populate("room")) as Room;

      const direction = Math.random();

      let deltaX = 0;
      let deltaY = 0;

      /* eslint-disable no-fallthrough */
      switch (true) {
        case direction < 0.25:
          if (x < width - 1) {
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
          if (y < height - 1) {
            deltaY = 1;
          }
      }
      /* eslint-enable no-fallthrough */

      if (deltaX === 0 && deltaY === 0) {
        return;
      }

      await npc.atomicSet("position", {
        x: x + deltaX,
        y: y + deltaY
      });
    }, 900)
  ];

  return () => {
    timers.forEach(clearInterval);
  };
}
