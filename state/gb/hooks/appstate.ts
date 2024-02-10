import React from "react";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export const useRefresh = (refetch: () => void) => {
  const [isConnected, setIsConnected] = React.useState(null);

  React.useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") refetch();
    };
    const listener = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      listener.remove();
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && !isConnected) refetch();
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, [isConnected, refetch]);
};
