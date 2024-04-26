const pokemonGallery = document.getElementById("pokemon-gallery");
const pagesContainer = document.getElementById("pages-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const modal = document.getElementById("modal");
const closeButton = document.getElementById("closeButton");

const modalTitle = document.getElementById("modal-title");
const modalImg = document.getElementById('modal-img');
const modalHeight = document.getElementById('modal-height');
const modalWeight = document.getElementById('modal-weight');
const modalType = document.getElementById('modal-type');

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

const closePokemonDetails = () => {
  modalImg.src = "./images/pokeball.gif";
  modalTitle.textContent = "";
  modalHeight.textContent = "";
  modalWeight.textContent = "";
  modalType.textContent = "";
  modalType.style.backgroundColor = "";
  modal.close();
}

prevBtn.addEventListener('click', () => {
  if (offset > 1) {
    offset -= pokemonPerPage;
    removeChildNodes(pokemonGallery);
    createPokemonList(offset)
  }
});

nextBtn.addEventListener('click', () => {
  offset += pokemonPerPage;
  removeChildNodes(pokemonGallery)
  createPokemonList(offset);
});

const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const createPokemonList = async (offset) => {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`;
    const response = await fetch(url);
    const data = await response.json();

    data.results.forEach((pokemon) => {
      const pokemonEl = document.createElement("div");
      pokemonEl.classList.add("pokemon");

      const pokemonFrontEl = document.createElement("div");
      pokemonFrontEl.innerHTML = `
        <p class="name">${capitalize(pokemon.name)} </p>
      `;
      pokemonEl.appendChild(pokemonFrontEl);
      pokemonGallery.appendChild(pokemonEl);

      pokemonFrontEl.addEventListener("click", () => {
        showPokemonDetails(pokemon.url);
      });
    });

    prevBtn.disabled = !data.previous;
    nextBtn.disabled = !data.next;

  } catch (error) {
    console.error("Error fetching Pokémon list: ", error);
  }
  modal.addEventListener("click", e => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      closePokemonDetails();
      currentPokemonUrl = null;
    }
  });
  closeButton.addEventListener("click", closePokemonDetails);
};



const showPokemonDetails = async (pokemonUrl) => {
  try {
    const response = await fetch(pokemonUrl);
    const pokemonData = await response.json();

    const pokeTypes = capitalize(pokemonData.types[0].type.name);
    const typeColor = colors[pokemonData.types[0].type.name];

    modalTitle.textContent = `#${pokemonData.id.toString().padStart(3, 0)} ${capitalize(pokemonData.name)}`;
    modalImg.src = pokemonData.sprites.front_default ? pokemonData.sprites.front_default : "./images/notFoundPokemon.gif";
    modalHeight.textContent = (pokemonData.height / 10).toFixed(1) + "m";
    modalWeight.textContent = (pokemonData.weight / 10) + "kg";
    modalType.textContent = pokeTypes;
    modalType.style.backgroundColor = typeColor;

    modal.showModal();
  } catch (error) {
    console.error("Error fetching Pokémon details: ", error);
  }
}

createPokemonList(offset);