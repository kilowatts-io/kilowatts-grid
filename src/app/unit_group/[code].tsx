// create a hello world page

import {
  HeaderBar,
  UnitGroupScreen as Screen,
} from "@/src/components/split-screen";
import { WithAppData } from "@/src/contexts/data";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

const FuelTypeScreen: React.FC = () => {
  const code = useLocalSearchParams().code as string;
  const [title, setTitle] = React.useState<string>(`Loading unit ${code}`);
  const [backUrl, setBackUrl] = React.useState<string | undefined>();
  return (
    <>
      <Stack.Screen
        options={{
          header: (props) => (
            <HeaderBar title={title} backUrl={backUrl} {...props} />
          ),
        }}
      />
      <WithAppData>
        <Screen code={code} setTitle={setTitle} setBackUrl={setBackUrl} />
      </WithAppData>
    </>
  );
};

export default FuelTypeScreen;
