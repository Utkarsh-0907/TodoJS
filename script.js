function editElement(element) {
  const originalText = element.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;

  const elementClass = element.className;

  element.replaceWith(input);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const newText = input.value.trim();

      if (newText) {
        const updatedElement = document.createElement(element.tagName);
        updatedElement.textContent = newText;
        updatedElement.className = elementClass;

        updatedElement.addEventListener("click", function () {
          editElement(updatedElement);
        });

        input.replaceWith(updatedElement);
      } else {
        const restoredElement = document.createElement(element.tagName);
        restoredElement.textContent = originalText;
        restoredElement.className = elementClass;
        input.replaceWith(restoredElement);
      }
    }
  });

  input.focus();
}

function addCard(button) {
  const title = document.createElement("input");
  title.className = "card";

  button.parentElement.insertBefore(title, button);

  title.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const cardText = title.value;

      if (cardText.trim()) {
        const card = document.createElement("div");
        card.className = "card";
        card.textContent = cardText;

        card.addEventListener("click", function () {
          editElement(card);
        });

        button.parentElement.insertBefore(card, button);
      }

      title.remove();
    }
  });
}

function addList() {
  const list = document.createElement("div");
  list.className = "list";

  const listTitleInput = document.createElement("input");
  listTitleInput.type = "text";
  listTitleInput.className = "list-title";
  listTitleInput.placeholder = "Enter list title...";

  list.appendChild(listTitleInput);
  listTitleInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const listTitle = document.createElement("h3");
      listTitle.textContent = listTitleInput.value;
      listTitle.className = "list-title";

      listTitle.addEventListener("click", function () {
        editElement(listTitle);
      });

      list.replaceChild(listTitle, listTitleInput);
    }
  });

  const addCardButton = document.createElement("button");
  addCardButton.className = "add-card";
  addCardButton.textContent = "+ Add a card";
  addCardButton.setAttribute("onclick", "addCard(this)");
  list.appendChild(addCardButton);

  document
    .getElementById("board")
    .insertBefore(list, document.querySelector(".add-list"));
}
