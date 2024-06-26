<script>
  // @ts-nocheck

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import Item from "./Item.svelte";
  import { getGuid, blurOnKey, sortOnName } from "./util";
  import Dialog from "./Dialog.svelte";
  import { flip } from "svelte/animate";
  import { linear } from "svelte/easing";
  import { scale } from "svelte/transition";

  export let categories;
  export let category;
  export let show;
  export let dnd;

  let editing = false;
  let itemName = "";
  let items = [];
  let message = "";
  let dialog = null;
  let hovering = false;
  const options = { duration: 700, easing: linear, times: 2 };

  $: items = Object.values(category.items);
  $: remaining = items.filter((item) => !item.packed).length;
  $: total = items.length;
  $: status = `${remaining} of ${total} remaining`;
  $: itemsToShow = sortOnName(items.filter((i) => shouldShow(show, i)));

  function addItem() {
    const duplicate = Object.values(categories).some((cat) =>
      Object.values(cat.items).some((item) => item.name === itemName)
    );
    if (duplicate) {
      message = `The item "${itemName}" already exists.`;
      dialog.showModal();
      return;
    }

    const { items } = category;
    const id = getGuid();
    items[id] = { id, name: itemName, packed: false };
    category.items = items;
    itemName = "";
    dispatch("persist");
  }

  function shouldShow(show, item) {
    return (
      show === "all" ||
      (show === "packed" && item.packed) ||
      (show === "unpacked" && !item.packed)
    );
  }

  function deleteItem(item) {
    delete category.items[item.id];
    category = category;
    dispatch("persist");
  }

  function spin(node, options) {
    const { easing, times = 1 } = options;
    return {
      ...options,
      css(t) {
        const eased = easing(t);
        const degress = 360 * times;
        return (
          "transform-origin: 50% 50%; " +
          `transform: scale(${eased}) ` +
          `rotate(${eased * degress}deg);`
        );
      },
    };
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
  in:scale={options}
  out:spin={options}
  class:hover={hovering}
  on:dragenter={() => (hovering = true)}
  on:dragleave={(event) => {
    const { localName } = event.target;
    if (localName === "section") hovering = false;
  }}
  on:drop|preventDefault={(event) => {
    dnd.drop(event, category.id);
    hovering = false;
  }}
  on:dragover|preventDefault
>
  <h3>
    {#if editing}
      <!-- svelte-ignore a11y-autofocus -->
      <input
        autofocus
        bind:value={category.name}
        on:blur={() => (editing = false)}
        on:keypress={blurOnKey}
      />
    {:else}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span on:click={() => (editing = true)}>{category.name}</span>
    {/if}
    <span class="status">{status}</span>
    <button class="icon" on:click={() => dispatch("delete")}>&#x1F5D1;</button>
  </h3>

  <form on:submit|preventDefault={addItem}>
    <label>
      New Item
      <input bind:value={itemName} data-testid="item-input" />
    </label>
    <button disabled={!itemName}>Add Item</button>
  </form>

  <ul>
    {#each itemsToShow as item (item.id)}
      <div animate:flip>
        <Item
          bind:item
          on:delete={() => deleteItem(item)}
          categoryId={category.id}
          {dnd}
        />
      </div>
    {:else}
      <div>This category does not contain any items yet.</div>
    {/each}
  </ul>

  <Dialog title="Category" bind:dialog>
    <div>{message}</div>
  </Dialog>
</section>

<style>
  button,
  input {
    border: solid lightgray 1px;
  }

  button.icon {
    border: none;
  }

  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
  }

  section {
    --padding: 10px;

    background-color: white;
    border: solid transparent 3px;
    border-radius: var(--padding);
    color: black;
    display: inline-block;
    margin: var(--padding);
    padding: calc(var(--padding) * 2);
    padding-top: var(--padding);
    vertical-align: top;
  }

  .status {
    font-size: 18px;
    font-weight: normal;
    margin: 0 15px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding-left: 0;
  }
  .hover {
    border-color: orange;
  }
</style>
