import { action } from "@storybook/addon-actions";
import Item from "../lib/Item.svelte";
import "../app.css";

export default {
  title: "Item",
};

const getOptins = (packed) => ({
  Component: Item,
  props: {
    categoryId: 1,
    dnd: {},
    item: { id: 2, name: "socks", packed },
  },
  on: { delete: action("item delete dispatched") },
});

export const unpacked = () => getOptins(false);
export const packed = () => getOptins(true);
