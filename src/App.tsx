import React from "react";
import GlobalStyle from "./GlobalStyles";
import CommentList from "./components/CommentList";
import "normalize.css";
import NaverLogin from "./components/NaverLogin";

const splitted = window.location.pathname.split("/");
const isValid =
  splitted.length === 3 && splitted[1].length > 0 && splitted[2].length > 0;
function App() {
  return (
    <>
      <GlobalStyle />
      {isValid && (
        <>
          <NaverLogin />
          <CommentList consumerID={splitted[1]} sequenceID={splitted[2]} />
        </>
      )}
    </>
  );
}

export default App;
