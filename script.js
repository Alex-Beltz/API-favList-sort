async function fetchData() {
  try {
    const response = await fetch(
      "https://freerandomapi.cyclic.app/api/v1/dogs?limit=30"
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

const waitForDOMContentLoaded = () => {
  window.addEventListener("DOMContentLoaded", () => {
    fetchData().then(buildMainList);
  });
};

const listContainer = document.querySelector(".list-container");
const mainList = document.querySelector(".main-list");
const favoritesList = document.querySelector(".favorites-list");
const buttonContainer = document.querySelector(".button-container");

const sortButtonAZ = document.createElement("button");
sortButtonAZ.innerHTML = "Sort favorites (A-Z)";

const reverseFavList = document.createElement("button");
reverseFavList.innerHTML = "Reverse order";

const mainListTitle = document.createElement("h1");
mainListTitle.innerHTML = "All Dogs-->";
mainListTitle.style.color = "rgb(0, 61, 39)";

const favListTitle = document.createElement("h1");
favListTitle.innerHTML = "<--Favorites List";
favListTitle.style.color = "rgb(1, 21, 80)";

buttonContainer.append(
  mainListTitle,
  favListTitle,
  sortButtonAZ,
  reverseFavList
);

listContainer.appendChild(buttonContainer);

function buildMainList(data) {
  data.data.forEach((dog) => {
    const mainListItem = document.createElement("div");
    mainListItem.classList.add("main-list-item");
    mainListItem.innerHTML = `
        <div class="main-item-info">
          <span>
            <h6>name:</h6>
            <h3 class="main-item-name">${dog.name}</h3>
          </span>
          <span>
            <h6>age:</h6>
            <h4 class="main-item-age">${dog.age}</h4>
          </span>
          <span>
            <h6>breed:</h6>
            <h5 class="main-item-breed">${dog.breed}</h5>
          </span>
        </div>
        <div class="main-item-pic" style="background-image: url(${dog.photoUrl})"></div>
      `;
    mainList.appendChild(mainListItem);
    listContainer.appendChild(mainList);

    mainListItem.addEventListener("click", () => {
      moveItemsToTheOtherList(mainListItem);
    });
  });
}

function moveItemsToTheOtherList(mainListItem) {
  if (mainListItem.parentNode === mainList) {
    mainListItem.remove();
    const favListItem = mainListItem.cloneNode(true);
    favListItem.classList.remove("main-list-item");
    favListItem.classList.add("fav-list-item");
    favListItem
      .querySelector(".main-item-name")
      .classList.replace("main-item-name", "fav-item-name");
    favListItem
      .querySelector(".main-item-age")
      .classList.replace("main-item-age", "fav-item-age");
    favListItem
      .querySelector(".main-item-breed")
      .classList.replace("main-item-breed", "fav-item-breed");
    favListItem
      .querySelector(".main-item-pic")
      .classList.replace("main-item-pic", "fav-item-pic");

    favListItem.addEventListener("click", () => {
      favListItem.remove();
      mainList.appendChild(mainListItem);
    });
    favoritesList.appendChild(favListItem);
  }
}

sortButtonAZ.addEventListener("click", () => {
  sortFavList();
});

const sortFavList = () => {
  const favListItems = [...favoritesList.querySelectorAll(".fav-list-item")];
  favListItems.sort((a, b) => {
    const nameA = a.querySelector(".fav-item-name").innerHTML;
    const nameB = b.querySelector(".fav-item-name").innerHTML;
    return nameA.localeCompare(nameB);
  });
  favListItems.forEach((item) => {
    favoritesList.appendChild(item);
  });
};

const reverseFavListOrder = () => {
  const favListItems = [...favoritesList.querySelectorAll(".fav-list-item")];
  favListItems.reverse();
  favListItems.forEach((item) => {
    favoritesList.appendChild(item);
  });
};

let isReverse = false;
reverseFavList.addEventListener("click", () => {
  if (isReverse) {
    sortFavList();
    isReverse = false;
  } else {
    reverseFavListOrder();
    isReverse = true;
  }
});

waitForDOMContentLoaded();
