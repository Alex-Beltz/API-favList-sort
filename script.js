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
    fetchData().then((data) => buildMainList(data));
  });
};

const body = document.querySelector(".body");
const mainList = document.querySelector(".main-list");
const favoritesList = document.querySelector(".favorites-list");
const buttonContainer = document.querySelector(".button-container");

const sortBtnAZ = document.createElement("button");
sortBtnAZ.innerHTML = "Sort favorites (A-Z)";
sortBtnAZ.setAttribute("data-sort", "asc");

const sortBtnZA = document.createElement("button");
sortBtnZA.innerHTML = "Sort favorites (Z-A)";
sortBtnZA.setAttribute("data-sort", "desc");

const mainCount = document.createElement("div");
mainCount.classList.add("main-count");

const favCount = document.createElement("div");
favCount.classList.add("fav-count");

buttonContainer.append(sortBtnAZ, sortBtnZA, mainCount, favCount);
body.appendChild(buttonContainer);

let mainOverEight = 0;
let mainUnderEight = 0;
let favOverEight = 0;
let favUnderEight = 0;

function countAge(list, overEight, underEight) {
  list.querySelectorAll(".main-item-age, .fav-item-age").forEach((age) => {
    const ageValue = parseInt(age.textContent);
    if (ageValue > 8) {
      overEight++;
    } else {
      underEight++;
    }
  });
}

function updateCountDisplay() {
  mainCount.innerHTML = `Dogs Over 8 y/o: ${mainOverEight} Dogs 8 y/o & Under: ${mainUnderEight}`;
  favCount.innerHTML = `Dogs Over 8 y/o: ${favOverEight} Dogs 8 y/o & Under: ${favUnderEight}`;
}

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
        `;

    const imageLayer = document.createElement("div");
    imageLayer.classList.add("imageLayer");
    imageLayer.style.backgroundImage = `url(${dog.photoUrl})`;
    imageLayer.style.zIndex = "0";

    mainListItem.appendChild(imageLayer);

    mainList.appendChild(mainListItem);
    body.appendChild(mainList);

    mainListItem.addEventListener("mouseover", () => {
      imageLayer.style.opacity = "0.25";
    });

    mainListItem.addEventListener("mouseout", () => {
      imageLayer.style.display = "block";
      imageLayer.style.opacity = "1";
    });

    mainListItem.addEventListener("click", () => {
      moveItem(mainListItem);
    });
  });
}

const classReplace = (str, array) => {
  array
    .querySelector(`.main-item-${str}`)
    .classList.replace(`main-item-${str}`, `fav-item-${str}`);
};

function moveItem(mainListItem) {
  if (mainListItem.parentNode === mainList) {
    mainListItem.remove();
    const favListItem = mainListItem.cloneNode(true);
    favListItem.classList.remove("main-list-item");
    favListItem.classList.add("fav-list-item");

    ["name", "age", "breed"].forEach((prop) => {
      classReplace(prop, favListItem);
    });

    favListItem.addEventListener("click", () => {
      favListItem.remove();
      mainList.appendChild(mainListItem);
    });
    favoritesList.appendChild(favListItem);
  }
}

[sortBtnAZ, sortBtnZA].forEach((button) => {
  const direction = button.dataset.sort;
  button.addEventListener("click", () => {
    sortFavList(direction);
  });
});

const sortFavList = (dir) => {
  const favListItems = [...favoritesList.querySelectorAll(".fav-list-item")];
  favListItems.sort((a, b) => {
    const nameA = a.querySelector(".fav-item-name").innerHTML;
    const nameB = b.querySelector(".fav-item-name").innerHTML;
    if (nameA < nameB) {
      return dir === "asc" ? -1 : 1;
    }
    if (nameA > nameB) {
      return dir === "asc" ? 1 : -1;
    }
  });
  favListItems.forEach((item) => {
    favoritesList.appendChild(item);
  });
};

waitForDOMContentLoaded();
