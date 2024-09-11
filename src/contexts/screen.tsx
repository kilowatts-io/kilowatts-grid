import { useRouter } from "expo-router";
import React from "react";
import { Appbar } from "react-native-paper";



export const HomeContext: ScreenHeaderContext = {
  title: `Kilowatts Grid`,
};

export const ScreenContext = React.createContext<ScreenHeaderContext | null>(
  null
);

export const useScreenHeaderContext = () => React.useContext(ScreenContext);


export const CustomAppbarHeader: React.FC<ScreenHeaderContext> = (ctx) => {
  const router = useRouter();
  return (
    <Appbar.Header>
      {ctx.backUrl && (
        <Appbar.BackAction onPress={() => router.navigate(ctx.backUrl!)} />
      )}
      <Appbar.Content title={ctx.title} />
      {ctx.headerRight}
    </Appbar.Header>
  );
};
