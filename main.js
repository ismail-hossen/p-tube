async function fetchData(api) {
  const data = await fetch(api);
  const rs = await data.json();
  return rs;
}

function getDateTime(sec) {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  return `${hours}hrs ${minutes} min ago`;
}

async function btnClick(id = null) {
  const categories = await fetchData(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  const cardSection = document.getElementById("card-section");
  const allCategoryBtn = document.getElementsByClassName("category-btn");
  const clickedBtn = document.getElementById(id);
  const notFound = document.getElementById("not-found");

  if (id) {
    for (let i = 0; i < allCategoryBtn.length; i++) {
      allCategoryBtn[i].classList.remove(
        "btn-error",
        "text-white",
        "font-medium",
        "text-xl"
      );
    }

    clickedBtn.classList.add(
      "btn-error",
      "text-xl",
      "font-medium",
      "text-white"
    );
  }

  if (categories?.status) {
    const itemsByCategory = await fetchData(
      `https://openapi.programming-hero.com/api/videos/category/${
        id || categories?.data[0].category_id
      }`
    );

    if (!itemsByCategory.status) {
      cardSection.classList.remove("grid");
      cardSection.classList.add("hidden");
      notFound.classList.remove("hidden");
      notFound.classList.add("flex");
    } else {
      cardSection.innerHTML = "";
      cardSection.classList.remove("hidden");
      cardSection.classList.add("grid");
      notFound.classList.remove("flex");
      notFound.classList.add("hidden");
      itemsByCategory?.data?.forEach((element) => {
        const { thumbnail, title, authors, others } = element;
        cardSection.innerHTML += `<div class="card w-[27rem] bg-base-100">
    <figure class="relative w-full h-5/6"><img class="h-full w-full rounded-md" src="${thumbnail}"
        alt="" />
    <span id="date-time" class="absolute bg-black text-white rounded-md bottom-3 right-3 px-2">${
      others.posted_date ? getDateTime(others.posted_date) : ""
    }</span>    
    </figure>
    <div class="flex gap-3 px-0 py-4">
      <img class="rounded-full w-12 h-12" src="${authors[0].profile_picture}" />
      <div class="flex flex-col gap-2">
        <h2 class="font-bold text-xl">${title}</h2>
        <div class="flex items-center justify-start gap-2">
          <p>${authors[0].profile_name}</p>
          <img class="w-4" src="${
            authors[0].verified ? "images/blue-badge.png" : ""
          }" alt="" />
        </div>
        <p><span class="views">${others.views}</span> views</p>
      </div>
    </div>
  </div>`;
      });
    }
  }
}

btnClick();

async function getCategories() {
  const categories = await fetchData(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  const btnParent = document.getElementById("category-btn");

  if (categories?.status) {
    categories?.data?.forEach(async (element) => {
      btnParent.innerHTML += `<button id="${
        element.category_id
      }" onclick="btnClick(${element.category_id})" class="category-btn btn ${
        categories.data[0].category_id == element.category_id
          ? "btn-error text-white font-medium text-xl"
          : "btn-active"
      }">${element.category}</button>`;
    });
  }
}

getCategories();

// Sort by views
document.getElementById("sort-by-views").addEventListener("click", async () => {
  var cardSec = document.getElementById("card-section");
  var arr = Array.prototype.slice.call(cardSec.childNodes, 0);

  arr.sort(function (a, b) {
    var aEle = a.getElementsByClassName("views")[0].innerText;
    var bEle = b.getElementsByClassName("views")[0].innerText;
    if (parseFloat(aEle) < parseFloat(bEle)) return 1;
    if (parseFloat(aEle) > parseFloat(bEle)) return -1;
    return 0;
  });

  cardSec.innerHTML = "";

  arr.forEach((element) => {
    cardSec.appendChild(element);
  });
});
