import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  }
  .btn-image {
  transition: all .2s;
  outline: 0;
  border: 1px solid transparent;
  padding: .5rem !important;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
}
  .btn-social-login {
  transition: all .2s;
  outline: 0;
  border: 1px solid transparent;
  padding: .5rem !important;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
}
.btn-image:disabled {
  opacity:.5;
}
.btn-image:hover {
  box-shadow: 0 0 0 .2rem rgba(15,20,25, .25);
}
.btn-social-login:hover {
  box-shadow: 0 0 0 .2rem rgba(0, 123, 255, .25);
}
.btn-social-login.kakao:hover {
  box-shadow: 0 0 0 .2rem rgba(254, 229, 0, .25);
}
.text-dark { color: #343a40!important; }
`;

export default GlobalStyle;
