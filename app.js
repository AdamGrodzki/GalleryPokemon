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

let offset = 1;
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
  for (let i = offset; i <= offset + limit; i++) {
    await getPokemon(i);
  }
  // const idTable = [];
  // const url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`;

  // fetch(url)
  //   .then((respone) => respone.json())
  //   .then((data) => {
  //     data.results.forEach((el) => {
  //       idTable.push(el.url.spplit("/")[6]);
  //     })
  //   })
  // idTable.forEach((el) => {
  //   getPokemon(el)
  // })
};

const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  // const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
  const res = await fetch(url);
  const data = await res.json();
  createPokemonCard(data)
};


const removeChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// const pokeRequest = () => {
fetchPokemons();

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
  const pokeTypes = pokemon.types.map((type) => type.type.name);
  const type = mainTypes.find((type) => pokeTypes.indexOf(type) > -1);
  const color = colors[type];

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

  console.log("offset: ", offset)

  document.getElementById("prev").disabled = (offset === 1) ? true : false;

  document.getElementById("next").disabled = (offset === 141) ? true : false;
}

const showPokemonDetails = (data) => {
  const titleModal = document.getElementById("modal-title");
  const imgModal = document.getElementById('modal-img');
  const heightModal = document.getElementById('modal-height');
  const weightModal = document.getElementById('modal-weight');
  const typeModal = document.getElementById('modal-type');
  const pokeTypes = data.types.map((type) => type.type.name);

  titleModal.textContent = `#${data.id.toString().padStart(3, 0)} ${capitalize(data.name)}`;
  imgModal.src = data.sprites.front_default;
  heightModal.textContent = (data.height / 10).toFixed(1) + "m";
  weightModal.textContent = (data.weight / 10) + "kg";
  typeModal.textContent = capitalize(mainTypes.find((type) => pokeTypes.indexOf(type) > -1));
  // typeModal.style.backgroundColor = colors[pokeTypes];
}


const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

