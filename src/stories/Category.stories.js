import { action } from "@storybook/addon-actions";
import "../app.css";
import Category from "../lib/Category.svelte";

export default {
  title: "Category",
};

const getOptins = (items) => {
  const category = { id: 1, name: "Clothes", items };
  return {
    Component: Category,
    props: {
      category,
      categories: { [category.id]: category },
      dnd: {},
      show: "all",
    },
    on: { delete: action("category delete dispatched") },
  };
};

export const empty = () => getOptins({});
export const nonEmpty = () =>
  getOptins({
    1: { id: 1, name: "socks", packed: true },
    2: { id: 2, name: "shoes", packed: false },
  });
