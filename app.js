const pokemonGallery = document.getElementById("pokemon-gallery");
const pagesContainer = document.getElementById("pages-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const modal = document.getElementById("modal");
const close = document.getElementById("close");

let titleModal = document.getElementById("modal-title");
let imgModal = document.getElementById('modal-img');
let heightModal = document.getElementById('modal-height');
let weightModal = document.getElementById('modal-weight');
let typeModal = document.getElementById('modal-type');


const colors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const mainTypes = Object.keys(colors);

let offset = 0;
const pokemonPerPage = 20;

prevBtn.addEventListener('click', () => {
  if (offset > 1) {
    offset -= 20;
    removeChildNodes(pokemonGallery);
    createPokemonCard(offset)
  }
});

nextBtn.addEventListener('click', () => {
  offset += 20;
  removeChildNodes(pokemonGallery)
  createPokemonCard(offset);
});

const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
const createPokemonCard = async (offset) => {
  const idTable = [];
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`;

  const response = await fetch(url);
  const data = await response.json()

  data.results.forEach((el) => {
    idTable.push(el.url.split("/")[6]);
  });

  for (let i = 0; i < data.results.length; i++) {
    const pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");

    const name = data.results[i].name;

    const pokemonFrontEl = document.createElement("div");
    pokemonFrontEl.innerHTML = `
    <p class="name">${capitalize(name)} </p>
  `;
    pokemonEl.appendChild(pokemonFrontEl);
    pokemonGallery.appendChild(pokemonEl);


    let currentPokemonUrl = null;

    const closePokemonDetails = () => {
      imgModal.src = "./images/pokeball.gif";
      titleModal.textContent = " ";
      heightModal.textContent = " ";
      weightModal.textContent = " ";
      typeModal.textContent = " ";
      typeModal.style.backgroundColor = " ";
      modal.close();
    }

    close.addEventListener("click", closePokemonDetails)

    pokemonFrontEl.addEventListener("click", () => {
      if (currentPokemonUrl !== data.results[i].url) {
        closePokemonDetails();
        showPokemonDetails(data.results[i].url);
        modal.showModal();
        currentPokemonUrl = data.results[i].url;
      }
    });

    modal.addEventListener("click", e => {
      const dialogDimensions = modal.getBoundingClientRect()
      if
        (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        closePokemonDetails();
        currentPokemonUrl = null;
      }
    });
  }
  document.getElementById("prev").disabled = (data.previous === null) ? true : false;
  document.getElementById("next").disabled = (data.next === null) ? true : false;
};

const showPokemonDetails = async (pokemonUrl) => {

  const response = await fetch(pokemonUrl);
  const pokemonData = await response.json();

  const pokeTypes = capitalize(pokemonData.types[0].type.name);
  const typeColor = colors[pokemonData.types[0].type.name];


  titleModal.textContent = `#${pokemonData.id.toString().padStart(3, 0)} ${capitalize(pokemonData.name)}`;
  imgModal.src = pokemonData.sprites.front_default ? pokemonData.sprites.front_default : "./images/notFoundPokemon.gif";
  heightModal.textContent = (pokemonData.height / 10).toFixed(1) + "m";
  weightModal.textContent = (pokemonData.weight / 10) + "kg";
  typeModal.textContent = pokeTypes;
  typeModal.style.backgroundColor = typeColor;

}
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

createPokemonCard();