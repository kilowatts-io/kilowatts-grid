// create a hello world page

import React from "react";
import { WithAppData } from "../contexts/data";
import { HomeScreen } from "../components/split-screen";

const App: React.FC = () => {
 
  return (
    <WithAppData>
      <HomeScreen/>
    </WithAppData>
  );
};

export default App;
