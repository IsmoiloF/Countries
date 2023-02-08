"use strict";

let them = document.querySelector("#them"),
  header = document.querySelector("header");
let select = document.querySelector("#region");

them.addEventListener("input", (e) => {
  localStorage.setItem("them", e.target.checked);
  changeMode();
});

function changeMode() {
  let mode = localStorage.getItem("them");

  if (mode === "true") {
    document.body.style.cssText = "background-color:#202C36; color:#fff;";
    header.style.cssText = "background-color:#2B3844; color:#fff;";
  } else {
    document.body.style.cssText = "background-color:#F2F2F2; color:#000;";
    header.style.cssText = "background-color:#ffff; color:#000;";
  }
}

changeMode();

// ---------------------------- DYNAMIC CARDS ----------------------------

let baseURL = "https://restcountries.com/v2/all";
let filterUrl = "https://restcountries.com/v2/region";
let searchUrl = "https://restcountries.com/v2/name";
let wrapperCards = document.querySelector(".card__wrapper");

const getAllCountries = async () => {
  wrapperCards.innerHTML = `<span class="loader"></span>`;

  try {
    const response = await fetch(baseURL);
    const result = await response.json();

    if (response.status === 200) {
      renderCards(result);
      filterRegion(result);
      console.log(result);
    }
  } catch (err) {
    console.log("Error message " + err);
  }
};

getAllCountries();

// ---------------------- render cards ----------------------------

function renderCards(cards) {
  wrapperCards.innerHTML = ``;

  cards.forEach((element) => {
    const card = createElement(
      "div",
      "rounded-[5px] shadow-lg bg-white max-w-sm w-[264px] h-[336px]",
      `
    
              <a href="#!">
                <img
                  class="rounded-t-lg w-full h-[160px]"
                  src="${element.flags.svg}"
                  alt="img"
                />
              </a>

              <div class="p-6 pb-7">
                <h5 class="text-gray-900 text-xl font-medium mb-2">
                  ${element.name}
                </h5>

                <ul class="list-none">
                  <li><strong>Population:</strong> ${element.population}</li>
                  <li><strong>Region:</strong> ${element.region}</li>
                  <li><strong>Capital:</strong> ${
                    element.capital || "not-found"
                  }</li>
                </ul>
              </div>
    
        `
    );

    wrapperCards.append(card);
  });
}

function filterRegion(data) {
  const region = [];
  data.forEach((item) => {
    if (!region.includes(item.region)) {
      region.push(item.region);
    }
  });

  region.sort();
  region.forEach((item) => {
    const option = createElement("option", "item", item);
    select.append(option);
  });
}

async function filterRegions(region) {
  wrapperCards.innerHTML = `<span class="loader"></span>`;
  const respons = await fetch(`${filterUrl}/${region}`);
  const result = await respons.json();

  renderCards(result);
}

select.addEventListener("change", (e) => {
  wrapperCards.innerHTML = ``;
  filterRegions(e.target.value);
});

//---------------------dinamic select option end -----------------

// ----------------------search ----------------------------------

async function searchCountries(counntry){
  wrapperCards.innerHTML = `<span class="loader"></span>`;
  try {
    const response = await fetch(`${searchUrl}/${counntry}`);
    const result = await response.json();
    if(response.status === 200){
      renderCards(result)
    }else{
      wrapperCards.innerHTML = `BUnday davlat mavjud emas`;
    }

  } catch (error) {
    console.log(error)
  }
}



let searchInput = document.querySelector("#search");

searchInput.addEventListener("keyup", (e) => {

  if(e.target.value.trim().length>0){
    wrapperCards.innerHTML=``;
    searchCountries(e.target.value)
  }
  else{
    searchInput.setAttribute('placeholder' ,"Please enter country name")
    getAllCountries();
  }
});
