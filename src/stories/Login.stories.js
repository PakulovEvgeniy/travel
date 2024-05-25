import { action } from "@storybook/addon-actions";
import "../app.css";
import StyleWrapper from "./StyleWrapper.svelte";
import Login from "../lib/Login.svelte";

export default { title: "Login" };

export const basic = () => ({
  Component: StyleWrapper,
  props: {
    component: Login,
    style: `
        background-color: cornflowerblue;
        height: 100vh;
        padding: 1rem
    `,
  },
  on: { login: action("login dispatched") },
});
