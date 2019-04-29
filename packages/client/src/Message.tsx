import React from "react";

import { useBoopedSubscription } from "./generated/models";

export default function Message() {
  const { data, error, loading } = useBoopedSubscription();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error! [{error}]</div>;
  }

  return <div>{data!.booped}!</div>;
}
