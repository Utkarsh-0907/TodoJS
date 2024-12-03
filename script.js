const boardData = {};

function setupDragAndDrop() {
  document.getElementById("board").addEventListener("dragstart", function (e) {
    if (e.target.classList.contains("list")) {
      e.target.classList.add("dragging");
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          type: "list",
          listName: e.target.querySelector(".list-title").textContent,
        })
      );
    } else if (e.target.classList.contains("card")) {
      e.target.classList.add("dragging");
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          type: "card",
          cardText: e.target.textContent,
          sourceList: e.target.closest(".list").querySelector(".list-title")
            .textContent,
        })
      );
    }
  });

  document.getElementById("board").addEventListener("dragend", function (e) {
    if (e.target.classList.contains("list")) {
      e.target.classList.remove("dragging");
    } else if (e.target.classList.contains("card")) {
      e.target.classList.remove("dragging");
    }
  });

  document.getElementById("board").addEventListener("dragover", function (e) {
    e.preventDefault();
    const draggingElement = document.querySelector(".dragging");
    const targetList = e.target.closest(".list");
    const board = document.getElementById("board");

    if (draggingElement) {
      if (draggingElement.classList.contains("list")) {
        e.preventDefault();
      } else if (
        targetList &&
        targetList.querySelector(".list-title") &&
        draggingElement.classList.contains("card")
      ) {
        e.preventDefault();
      }
    }
  });

  document.getElementById("board").addEventListener("drop", function (e) {
    e.preventDefault();
    const board = document.getElementById("board");
    const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));

    if (dragData.type === "list") {
      const lists = Array.from(board.querySelectorAll(".list"));
      const currentList = lists.find(
        (list) =>
          list.querySelector(".list-title").textContent === dragData.listName
      );

      if (currentList) {
        const dropTargetList = e.target.closest(".list");
        if (dropTargetList && dropTargetList !== currentList) {
          const currentIndex = lists.indexOf(currentList);
          const targetIndex = lists.indexOf(dropTargetList);

          if (currentIndex !== -1 && targetIndex !== -1) {
            board.insertBefore(
              currentList,
              targetIndex > currentIndex
                ? dropTargetList.nextSibling
                : dropTargetList
            );
          }
        }
      }
    } else if (dragData.type === "card") {
      const targetList = e.target.closest(".list");

      if (targetList && targetList.querySelector(".list-title")) {
        const sourceListName = dragData.sourceList;
        const cardText = dragData.cardText;
        const targetListName =
          targetList.querySelector(".list-title").textContent;

        const sourceListCards = boardData[sourceListName];
        const cardIndex = sourceListCards.indexOf(cardText);
        if (cardIndex !== -1) {
          sourceListCards.splice(cardIndex, 1);
        }

        if (!boardData[targetListName]) {
          boardData[targetListName] = [];
        }
        boardData[targetListName].push(cardText);

        render();
      }
    }
  });
}

function render() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (const [listName, cards] of Object.entries(boardData)) {
    const list = document.createElement("div");
    list.className = "list";
    list.setAttribute("draggable", "true");

    const listTitleContainer = document.createElement("div");
    listTitleContainer.style.display = "flex";
    listTitleContainer.style.justifyContent = "space-between";
    listTitleContainer.style.alignItems = "center";

    const listTitle = document.createElement("h3");
    listTitle.textContent = listName;
    listTitle.className = "list-title";

    const deleteListIcon = document.createElement("span");
    deleteListIcon.className = "delete-list";
    deleteListIcon.textContent = "🗑️";

    deleteListIcon.addEventListener("click", function () {
      delete boardData[listName];
      render();
    });

    listTitle.addEventListener("click", function () {
      editElement(listTitle, listName);
    });

    listTitleContainer.appendChild(listTitle);
    listTitleContainer.appendChild(deleteListIcon);
    list.appendChild(listTitleContainer);

    cards.forEach((cardText, cardIndex) => {
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "card-wrapper";

      const cardContainer = document.createElement("div");
      cardContainer.className = "card-container";
      cardContainer.style.display = "flex";
      cardContainer.style.justifyContent = "space-between";
      cardContainer.style.alignItems = "center";

      const card = document.createElement("div");
      card.className = "card";
      card.textContent = cardText;

      card.setAttribute("draggable", "true");

      const deleteCardIcon = document.createElement("span");
      deleteCardIcon.className = "delete-card";
      deleteCardIcon.textContent = "🗑️";

      deleteCardIcon.addEventListener("click", function () {
        boardData[listName].splice(cardIndex, 1);
        render();
      });

      card.addEventListener("click", function () {
        editElement(card, listName, cardIndex);
      });

      cardContainer.appendChild(card);
      cardContainer.appendChild(deleteCardIcon);
      cardWrapper.appendChild(cardContainer);
      list.appendChild(cardWrapper);
    });

    const addCardButton = document.createElement("button");
    addCardButton.className = "add-card";
    addCardButton.textContent = "+ Add a card";

    addCardButton.addEventListener("click", function () {
      const cardInput = document.createElement("input");
      cardInput.className = "card";
      list.insertBefore(cardInput, addCardButton);

      cardInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && cardInput.value.trim()) {
          boardData[listName].push(cardInput.value.trim());
          render();
        }
      });
    });

    list.appendChild(addCardButton);
    board.appendChild(list);
  }

  const addListButton = document.createElement("button");
  addListButton.className = "add-list";
  addListButton.textContent = "+ Add a list";
  addListButton.addEventListener("click", addList);

  board.appendChild(addListButton);
}

function addList() {
  const board = document.getElementById("board");

  const list = document.createElement("div");
  list.className = "list";

  const listNameInput = document.createElement("input");
  listNameInput.type = "text";
  listNameInput.className = "list-title-input";
  listNameInput.placeholder = "Enter list title...";

  list.appendChild(listNameInput);

  listNameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && listNameInput.value.trim()) {
      const listName = listNameInput.value.trim();
      if (!boardData[listName]) {
        boardData[listName] = [];
        render();
      }
    }
  });

  board.insertBefore(list, board.lastElementChild);
  listNameInput.focus();
}

function editElement(element, listName = null, cardIndex = null) {
  const originalText = element.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = originalText;
  input.className = element.className;

  element.replaceWith(input);
  input.focus();

  input.addEventListener("blur", function () {
    const newText = input.value.trim();

    if (newText) {
      const updatedElement = document.createElement(element.tagName);
      updatedElement.textContent = newText;
      updatedElement.className = element.className;

      if (cardIndex !== null) {
        boardData[listName][cardIndex] = newText;

        updatedElement.addEventListener("click", function () {
          editElement(updatedElement, listName, cardIndex);
        });
      } else if (listName !== null) {
        boardData[newText] = boardData[listName];
        delete boardData[listName];

        updatedElement.addEventListener("click", function () {
          editElement(updatedElement, newText);
        });
      }

      input.replaceWith(updatedElement);
      render();
    } else {
      input.replaceWith(element);
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      input.blur();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  setupDragAndDrop();
});

const style = document.createElement("style");
style.textContent = `
  .card {
    cursor: move;
    user-select: none;
  }
  .card.dragging {
    opacity: 0.5;
  }
  .list {
    cursor: move;
    border: 2px dashed transparent;
    transition: border-color 0.3s;
  }
  .list.dragging {
    opacity: 0.5;
  }
  .list:hover {
    border-color: #ccc;
  }
`;
document.head.appendChild(style);
