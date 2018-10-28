import React from 'react';
import { render } from "react-dom";
import { ChimpWidget } from "./lib";

const App = () => (
  <div style={{ width: 640, margin: "15px auto" }}>
    <h1>Hello React</h1>
    <ChimpWidget     
      backendEndpoint="http://localhost:3000"
      mqttBrokerHost="http://localhost:8081/mqtt"
      title="Chimp Assist Demo"
      attendantAvatarURL="data:image/png;base64,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"
     />
  </div>
);

render(<App />, document.getElementById("root"));