const messageCont = document.createElement("div");
messageCont.style.cssText = `
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background-color: #4f3608;
`;
const message = document.createElement("h1");
message.style.cssText = `
  font-size: 48px;
  color: white;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
message.textContent =
  "Click any dog to add them to the favorites list, or to add them back to the main list. Press any key to continue";
messageCont.appendChild(message);
document.body.appendChild(messageCont);

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

const waitForKeyPress = () => {
  window.addEventListener("keydown", () => {
    document.body.removeChild(messageCont);
    fetchData().then((data) => buildMainList(data));
  });
};

const body = document.querySelector(".body");
const mainList = document.querySelector(".main-list");
const favList = document.querySelector(".fav-list");
const buttonContainer = document.querySelector(".button-container");

const createHeader = (headerClass, titleText, countClass) => {
  const header = document.createElement("div");
  header.classList.add(headerClass);
  const title = document.createElement("h1");
  title.innerHTML = titleText;
  const count = document.createElement("div");
  count.classList.add(countClass);
  header.append(title, count);
  return header;
};

const favListHeader = createHeader(
  "fav-header",
  `<i class="fas fa-arrow-left"></i> Favorites List`,
  "fav-count"
);
const mainListHeader = createHeader(
  "main-header",
  `Main List <i class="fas fa-arrow-right"></i>`,
  "main-count"
);

const createSortBtn = (text, dataAtr, dir) => {
  const btn = document.createElement("button");
  btn.innerHTML = text;
  btn.setAttribute(dataAtr, dir);
  return btn;
};
const sortBtnAZ = createSortBtn("Sort favorites (A-Z)", "data-sort", "asc");
const sortBtnZA = createSortBtn("Sort favorites (Z-A)", "data-sort", "desc");

buttonContainer.append(sortBtnAZ, sortBtnZA, mainListHeader, favListHeader);
body.appendChild(buttonContainer);

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

const classReplace = (from, to, prop, item) => {
  item
    .querySelector(`.${from}-item-${prop}`)
    .classList.replace(`${from}-item-${prop}`, `${to}-item-${prop}`);
};

const moveItem = (item) => {
  const fromList = favList.contains(item) ? "fav" : "main";
  const toList = fromList === "fav" ? "main" : "fav";

  document.querySelector(`.${fromList}-list`).removeChild(item);
  item.classList.remove(`${fromList}-list-item`);

  ["info", "name", "age", "breed"].forEach((prop) => {
    classReplace(fromList, toList, prop, item);
  });

  item.classList.add(`${toList}-list-item`);
  document.querySelector(`.${toList}-list`).appendChild(item);

  updateCount();
};

function updateCount() {
  const mainListItems = [...mainList.querySelectorAll(".main-list-item")];
  const favListItems = [...favList.querySelectorAll(".fav-list-item")];

  const mainListOver8 = mainListItems.filter(
    (item) => Number(item.querySelector(".main-item-age").textContent) > 8
  );

  const favListOver8 = favListItems.filter(
    (item) => Number(item.querySelector(".fav-item-age").textContent) > 8
  );

  document.querySelector(
    ".main-count"
  ).innerHTML = `Dogs Over 8 y/o: <span style="font-size: 1.5rem; font-weight: bold;">${
    mainListOver8.length
  }</span><br> Dogs 8 y/o & Under: <span style="font-size: 1.5rem; font-weight: bold;">${
    mainListItems.length - mainListOver8.length
  }</span>`;

  document.querySelector(
    ".fav-count"
  ).innerHTML = `Dogs Over 8 y/o: <span style="font-size: 1.5rem; font-weight: bold;">${
    favListOver8.length
  }</span><br> Dogs 8 y/o & Under: <span style="font-size: 1.5rem; font-weight: bold;">${
    favListItems.length - favListOver8.length
  }</span>`;
}

[sortBtnAZ, sortBtnZA].forEach((button) => {
  const direction = button.dataset.sort;
  button.addEventListener("click", () => {
    sortFavList(direction);
  });
});

const sortFavList = (dir) => {
  const favListItems = [...favList.querySelectorAll(".fav-list-item")];
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
    favList.appendChild(item);
  });
};

setTimeout(waitForKeyPress, 2000);
