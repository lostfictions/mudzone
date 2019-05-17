import React, { useEffect, useCallback } from "react";
import mousetrap from "mousetrap";

import {
  useRoomQuery,
  useEntityChangedSubscription,
  useMoveMutation,
  Direction
} from "../generated/models";

import styles from "./Room.module.css";

export default function Room() {
  return (
    <div className={styles.container}>
      <RoomDisplay />
      <Controls />
    </div>
  );
}

function RoomDisplay() {
  // TODO: subscribe to room instead of query
  const { error, loading, data } = useRoomQuery({
    variables: { id: "default" }
  });

  if (error) {
    console.error(error);
    return <div>Error! [{error}]</div>;
  }

  if (loading) {
    return <pre>L O A D I N G</pre>;
  }

  const { name: roomName, entities, width, height } = data!.room!;

  return (
    <div>
      <pre>{roomName}</pre>
      <div
        className={styles.roomgrid}
        style={{ "--cols": width, "--rows": height } as any}
      >
        {entities.map(({ id }) => (
          <Entity key={id} id={id} rows={height} />
        ))}
      </div>
    </div>
  );
}

function Entity({ id, rows }: { id: string; rows: number }) {
  const { error, loading, data } = useEntityChangedSubscription({
    variables: { id }
  });

  if (error) {
    console.error(error);
    return null;
  }

  if (loading) {
    return null;
  }

  const {
    position: { x, y },
    appearance,
    color
  } = data!.entityChanged;

  return (
    <pre style={{ color, gridColumn: x + 1, gridRow: rows - y }}>
      {appearance}
    </pre>
  );
}

function Controls() {
  const move = useMoveMutation();

  const moveLeft = useCallback(() => {
    move({ variables: { direction: Direction.Left } });
  }, [move]);
  const moveRight = useCallback(() => {
    move({ variables: { direction: Direction.Right } });
  }, [move]);
  const moveUp = useCallback(() => {
    move({ variables: { direction: Direction.Up } });
  }, [move]);
  const moveDown = useCallback(() => {
    move({ variables: { direction: Direction.Down } });
  }, [move]);

  useEffect(() => {
    mousetrap.bind("left", moveLeft);
    mousetrap.bind("right", moveRight);
    mousetrap.bind("up", moveUp);
    mousetrap.bind("down", moveDown);

    return () => {
      mousetrap.unbind("left");
      mousetrap.unbind("right");
      mousetrap.unbind("up");
      mousetrap.unbind("down");
    };
  }, [moveLeft, moveRight, moveUp, moveDown]);

  return (
    <div>
      <button onClick={moveLeft}>Left</button>
      <button onClick={moveUp}>Up</button>
      <button onClick={moveDown}>Down</button>
      <button onClick={moveRight}>Right</button>
    </div>
  );
}
