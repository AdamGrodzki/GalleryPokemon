const pokemonGallery = document.getElementById("pokemon-gallery");
const pagesContainer = document.getElementById("pages-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const modal = document.getElementById("modal");
const close = document.getElementById("close");

const apiUrl = "https://pokeapi.co/api/v2/pokemon";

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
let limit = 19;
const pokemonPerPage = 20;

prevBtn.addEventListener('click', () => {
  if (offset > 1) {
    offset -= 20;
    removeChildNodes(pokemonGallery);
    fetchPokemons(offset, limit)
  }
});

nextBtn.addEventListener('click', () => {
  offset += 20;
  removeChildNodes(pokemonGallery)
  fetchPokemons(offset, limit);
});


const fetchPokemons = async () => {
  // for (let i = offset; i <= offset + limit; i++) {
  //   await getPokemon(i);
  // }

  const idTable = [];
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`;

  const response = await fetch(url);
  const data = await response.json()

  data.results.forEach((el) => {
    idTable.push(el.url.split("/")[6]);
  })
  console.log("IdTable:", idTable)
  idTable.forEach((el) => {
    getPokemon(el)
  })
}
const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  createPokemonCard(data)
  // console.log("data", data)
};


const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
fetchPokemons();
// const pokeRequest = () => {
//   fetch(apiUrl)
//     .then((response) => response.json())
//     .then((data) => {

//       pagesContainer.innerHTML = "";
//       // totalPages = Math.ceil(data.count / pokemonPerPage);
//       totalPages = Math.ceil(151 / pokemonPerPage);
//       let currentPage = Math.ceil(offset / pokemonPerPage);

//       for (let i = 1; i <= totalPages; i++) {
//         const pageBtn = document.createElement("button")
//         pageBtn.textContent = i;

//         pageBtn.addEventListener("click", function () {
//           offset = (i - 1) * pokemonPerPage + 1;
//           removeChildNodes(pokemonGallery);
//           pokeRequest(`${apiUrl}"offset="${offset}"&limit=20"`)
//         })
//         if (i == currentPage) {
//           //make button active only when user is on that page 
//           pageBtn.classList.add("active")
//         }
//         pagesContainer.appendChild(pageBtn)
//       }
//       console.log("data:", data)
//     })
// }
// pokeRequest();

const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");

  const name = pokemon.name.toUpperCase();
  const type = pokemon.types[0].type.name;
  const color = colors[type];

  console.log("type", type)

  pokemonEl.style.backgroundColor = color;

  const pokemonFrontEl = document.createElement('div');
  pokemonFrontEl.innerHTML = `
  <p class="name">${name} </p>
  `;

  pokemonEl.appendChild(pokemonFrontEl);

  pokemonGallery.appendChild(pokemonEl);

  const closePokemonDetails = () => {
    modal.close();
  }
  close.addEventListener("click", closePokemonDetails)

  pokemonFrontEl.addEventListener("click", () => {
    showPokemonDetails(pokemon)
    modal.showModal();
  });

  modal.addEventListener("click", e => {
    const dialogDimensions = modal.getBoundingClientRect()
    if
      (e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close()
    }
  })

  // console.log("offset: ", offset)

  document.getElementById("prev").disabled = (offset === 0) ? true : false;
  document.getElementById("next").disabled = (offset === 140) ? true : false;
}

const showPokemonDetails = (data) => {
  const titleModal = document.getElementById("modal-title");
  const imgModal = document.getElementById('modal-img');
  const heightModal = document.getElementById('modal-height');
  const weightModal = document.getElementById('modal-weight');
  const typeModal = document.getElementById('modal-type');
  const pokeTypes = capitalize(data.types[0].type.name);
  const typeColor = colors[data.types[0].type.name];

  console.log("pokeTypes: ", pokeTypes)

  titleModal.textContent = `#${data.id.toString().padStart(3, 0)} ${capitalize(data.name)}`;
  imgModal.src = data.sprites.front_default;
  heightModal.textContent = (data.height / 10).toFixed(1) + "m";
  weightModal.textContent = (data.weight / 10) + "kg";
  typeModal.textContent = pokeTypes;
  typeModal.style.backgroundColor = typeColor;
}

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// buttony prev i next bazuja na offset "disabled