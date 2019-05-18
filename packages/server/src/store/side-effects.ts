import { Store } from "./store";

import { resolvers as messageResolvers } from "../gql/messages";
import { ResolverContext } from "../types/resolver-context";
import { Direction } from "../generated/graphql";
import { RoomDoc } from "../types/db-types";
import { canMoveInDirection } from "../gql/entities";

export function initSideEffects(store: Store) {
  const timers = [
    setInterval(() => {
      const context: ResolverContext = {
        userData: {
          id: "whatever",
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

      const room: RoomDoc = await npc.populate("room");

      const direction = Math.random();

      let deltaX = 0;
      let deltaY = 0;

      /* eslint-disable no-fallthrough */
      switch (true) {
        case direction < 0.25:
          if (await canMoveInDirection(npc, room, Direction.Right)) {
            deltaX = 1;
            break;
          }
        case direction < 0.5:
          if (await canMoveInDirection(npc, room, Direction.Down)) {
            deltaY = -1;
            break;
          }
        case direction < 0.75:
          if (await canMoveInDirection(npc, room, Direction.Left)) {
            deltaX = -1;
            break;
          }
        case direction < 1:
          if (await canMoveInDirection(npc, room, Direction.Up)) {
            deltaY = 1;
            // if we happen to be trying to move up and fail, we won't move at
            // all. that is, the ordering of cases here matters: trying to move
            // right will cycle through all the possible directions, trying to
            // move left will only try left and up, etc.

            // maybe a little weird, but until we have a better way of
            // doing hit testing maybe it's better not to do anything more
            // complex.
          }
      }
      /* eslint-enable no-fallthrough */

      if (deltaX === 0 && deltaY === 0) {
        return;
      }

      // TODO: techincally the whole block should be atomic, but who knows
      // whether rxdb even respects what it claims
      const { x, y } = npc.position;
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
