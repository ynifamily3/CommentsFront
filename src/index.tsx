import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AxiosConfigure from "./repo/_axios";
import dotenv from "dotenv";

dotenv.config();
AxiosConfigure();

ReactDOM.render(<App />, document.getElementById("root"));
