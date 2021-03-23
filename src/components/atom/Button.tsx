import styled from "styled-components";

const Button = styled.button`
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  :hover {
    background-color: #3e8e41;
  }
  :disabled {
    opacity: 0.5;
  }
`;

export default Button;
