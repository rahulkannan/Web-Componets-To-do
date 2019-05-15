const to_do_template = document.createElement("template");
to_do_template.innerHTML = `
<style>
    :host {
    display: block;
    font-family: sans-serif;
    text-align: center;
    }

    button {
    border: none;
    cursor: pointer;
    }

    ul {
    list-style: none;
    padding: 0;
    }
</style>
<h1>To do</h1>
<input type="text" placeholder="Add new to do"></input>
<button>✅</button>
<ul id="todos"></ul>
`;

class TodoApp extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "closed" });
    this._shadowRoot.appendChild(to_do_template.content.cloneNode(true));
    this.$todoList = this._shadowRoot.querySelector("ul");

    this.$todoInput = this._shadowRoot.querySelector("input");
    this.$submitTodo = this._shadowRoot.querySelector("button");
    this.$submitTodo.addEventListener("click", this._addTodo.bind(this));
  }

  _addTodo() {
    if (this.$todoInput.value.length > 0) {
      this._todos.push({
        text: this.$todoInput.value,
        checked: false
      });
      this._renderTodoList();
      this.$todoInput.value = "";
    }
  }

  getTodo() {
    return this._todos;
  }

  setTodo(value) {
    this._todos = value;
    this._renderTodoList();
  }

  _renderTodoList() {
    this.$todoList.innerHTML = " ";
    this._todos.forEach(todo => {
      let $todoItem = document.createElement("to-do-item");
      $todoItem.setAttribute("text", todo.text);
      this.$todoList.appendChild($todoItem);
    });
  }
}

window.customElements.define("to-do-app", TodoApp);

const todo_item_template = document.createElement("template");
todo_item_template.innerHTML = `
<style>
    :host {
    display: block;
    font-family: sans-serif;
    }

    .completed {
    text-decoration: line-through;
    }

    button {
    border: none;
    cursor: pointer;
    }
</style>
<li class="item">
    <input type="checkbox">
    <label></label>
    <button>❌</button>
</li>
`;

class TodoItem extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "closed" });
    this._shadowRoot.appendChild(todo_item_template.content.cloneNode(true));

    this.$item = this._shadowRoot.querySelector(".item");
    this.$removeItem = this._shadowRoot.querySelector("button");
    this.$text = this._shadowRoot.querySelector("label");
    this.$checkbox = this._shadowRoot.querySelector("input");

    this.$removeItem.addEventListener("click", e => {
      this.dispatchEvent(new CustomEvent("onRemove", { detail: this.index }));
    });

    this.$checkbox.addEventListener("click", e => {
      this.dispatchEvent(new CustomEvent("onToggle", { detail: this.index }));
    });
  }

  connectedCallback() {
    if (!this.hasAttribute("text")) {
      this.setAttribute("text", "placeholder");
    }
    this._renderTodoItem();
  }

  _renderTodoItem() {
    if (this.hasAttribute("checked")) {
      this.$item.classList.add("completed");
      this.$checkbox.setAttribute("checked", "");
    } else {
      this.$item.classList.remove("completed");
      this.$checkbox.removeAttribute("checked");
    }

    this.$text.innerText = this._text;
  }

  static get observedAttributes() {
    return ["text"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._text = newValue;
  }
}

window.customElements.define("to-do-item", TodoItem);

document
  .querySelector("to-do-app")
  .setTodo([
    { text: "Make a demo", checked: true },
    { text: "The boring stuff", checked: false },
    { text: "Setting properties", checked: false },
    { text: "Setting attributes", checked: false },
    { text: "Reflecting properties to attributes", checked: false },
    { text: "Events", checked: false },
    { text: "Wrap it up", checked: false }
  ]);
