<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import Category from "./Category.svelte";
  import { getGuid, sortOnName } from "./util";
  import Dialog from "./Dialog.svelte";
  import { flip } from "svelte/animate";

  let categoryArray = [];
  let categories = {};
  let categoryName;
  let message = "";
  let show = "all";
  let dialog = null;
  const options = { duration: 700 };

  $: categoryArray = sortOnName(Object.values(categories));

  function addCategory() {
    const duplicate = Object.values(categories).some(
      (cat) => cat.name === categoryName
    );
    if (duplicate) {
      message = `The category "${categoryName}" already exists.`;
      dialog.showModal();
      return;
    }
    const id = getGuid();
    categories[id] = { id, name: categoryName, items: {} };
    categories = categories;
    categoryName = "";
  }

  function clearAllChecks() {
    for (const category of Object.values(categories)) {
      for (const item of Object.values(category.items)) {
        item.packed = false;
      }
    }
    categories = categories;
  }

  function deleteCategory(category) {
    if (Object.values(category.items).length) {
      message = "This category is not empty.";
      dialog.showModal();
      return;
    }
    delete categories[category.id];
    categories = categories;
  }

  restore();

  $: if (categories) persist();

  function persist() {
    localStorage.setItem("travel-packing", JSON.stringify(categories));
  }

  function restore() {
    const text = localStorage.getItem("travel-packing");
    if (text && text !== "{}") {
      categories = JSON.parse(text);
    }
  }

  let dragAndDrop = {
    drag(event, categoryId, itemId) {
      const data = { categoryId, itemId };
      event.dataTransfer.setData("text/plain", JSON.stringify(data));
    },
    drop(event, categoryId) {
      const json = event.dataTransfer.getData("text/plain");
      const data = JSON.parse(json);
      const category = categories[data.categoryId];
      const item = category.items[data.itemId];
      delete category.items[data.itemId];
      categories[categoryId].items[data.itemId] = item;
      categories = categories;
    },
  };
</script>

<section>
  <header>
    <form on:submit|preventDefault={addCategory}>
      <label>
        New Category
        <input data-testid="category-name-input" bind:value={categoryName} />
      </label>
      <button disabled={!categoryName}>Add category</button>
      <button
        type="button"
        class="logout-btn"
        on:click={() => dispatch("logout")}>Log Out</button
      >
    </form>
    <p>
      Suggested categories include Backpack, Clothes,
      <br />
      Last Minute, Medicines, Running Gear, and Toiletries.
    </p>
    <fieldset>
      <div>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <legend>Show</legend>
        <label>
          <input name="show" type="radio" value="all" bind:group={show} />
          All
        </label>
        <label>
          <input name="show" type="radio" value="packed" bind:group={show} />
          Packed
        </label>
        <label>
          <input name="show" type="radio" value="unpacked" bind:group={show} />
          Unpacked
        </label>
        <button class="clear" on:click={clearAllChecks}>Clear all Checks</button
        >
      </div>
    </fieldset>
  </header>

  <div class="categories">
    {#each categoryArray as category (category.id)}
      <div class="wrapper" animate:flip={options}>
        <Category
          bind:category
          {categories}
          {show}
          on:delete={() => deleteCategory(category)}
          on:persist={persist}
          dnd={dragAndDrop}
        />
      </div>
    {/each}
  </div>

  <Dialog title="Checklist" bind:dialog>
    <div>{message}</div>
  </Dialog>
</section>

<style>
  .categories {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .clear {
    margin-left: 30px;
  }

  input[type="radio"] {
    --size: 24px;
    height: var(--size);
    width: var(--size);
    margin-left: 10px;
  }

  .logout-btn {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  fieldset {
    border: none;
    margin: 0;
    padding: 0;
  }
  fieldset > div {
    display: flex;
    align-items: center;
  }
  fieldset input {
    margin-left: 1.5rem;
  }
  fieldset legend {
    padding: 0;
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
    margin-top: 1em;
  }

  .animate {
    display: inline-block;
  }

  .wrapper {
    display: inline;
  }
</style>
