import { action } from "@storybook/addon-actions";
import "../app.css";
import StyleWrapper from "./StyleWrapper.svelte";
import Checklist from "../lib/Checklist.svelte";

export default { title: "Checklist" };

export const basic = () => ({
  Component: StyleWrapper,
  props: {
    component: Checklist,
    style: `
        background-color: cornflowerblue;
        color: white;
        height: 100vh;
        padding: 1rem
    `,
  },
  on: { logout: action("logout dispatched") },
});
