import React from "react";
import { useNowQuery } from "./now";
import { useMelsQuery } from "../../apis/elexon/api";
import { updateCapacity } from "../updates/capacity";

export const useMels = () => {
  const now = useNowQuery();
  const query = useMelsQuery(now.args.fromTo);
  React.useEffect(() => {
    if (query.data) {
      try {
        updateCapacity(now.now, query.data);
      } catch(e) {
        console.warn(e);
      }
    }
  }, [query.data, now.now]);
};
