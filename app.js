const pokemonGallery = document.getElementById("pokemon-gallery");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let limit = 19;
let offset = 1;
const url = `https://pokeapi.co/api/v2/pokemon/`;

prevBtn.addEventListener('click', ()=> {
  if( offset != 1){
    offset -=20;
    removeChildNodes(pokemonGallery);
    fetchPokemons(offset, limit)
  }
});

nextBtn.addEventListener('click', ()=> {
  offset += 20;
  removeChildNodes(pokemonGallery)
  fetchPokemons(offset, limit)
});


const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
  grass: '#63BB5B',   
};

const mainTypes = Object.keys(colors);

const fetchPokemons = async () => {
  for (let i = offset; i <=offset + limit; i++) {
    await getPokemon(i);
  }
};

const getPokemon = async (id) => {
  fetch(url + id)
  .then((res)=> res.json())
  .then((data) => {
    createPokemonCard(data)
  })
};



function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(offset, limit);

const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div");
  const pokemonElBack = document.createElement('div');
  pokemonEl.classList.add("pokemon");
  console.log(pokemon)

  const name = pokemon.name.toUpperCase();
  const img = pokemon.sprites['front_default'];
  const id = pokemon.id;
  const height = pokemon.height;
  const weight = pokemon.weight;
  const pokeTypes = pokemon.types.map((type) => type.type.name).join(", ");
  const type = mainTypes.find((type) => pokeTypes.indexOf(type) >-1);
  const color = colors[type];

  pokemonEl.style.backgroundColor = color;
  pokemonElBack.style.backgroundColor = color;

  // const pokemonInnerHTML = `
  //   <div class="img-container">
  //       <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${name}">
  //   </div>
  //   <div class="info">
  //       <span class="number">#${id}</span>
  //       <h3 class="name">${name}</h3>
  //       <p class="height">Height: ${height}<p>
  //       <p class="weight">Weight: ${weight}</p>
  //       <p class="type">Type: <span>${type}</span> </p>
  //   </div>
  //   `;
  // pokemonEl.innerHTML = pokemonInnerHTML;

  const pokemonFrontEl = document.createElement('div');
  pokemonFrontEl.classList.add('front');
  pokemonFrontEl.innerHTML = `
    <div class ="info">
    <h3 class="name">${name} </h3>
    </div>
    `;
  pokemonEl.appendChild(pokemonFrontEl);

  const pokemonBackEl = document.createElement('div');
  pokemonBackEl.classList.add('back');
  pokemonBackEl.classList.add('flipped');
  pokemonBackEl.innerHTML = `
  <p class="idPoke">#${id}</p>
  <div class="img-container">
      <img src="${img}" alt="${name}">
  </div>
  <div class="stats">
    <p class="height">Height: ${height}<p>
    <p class="weight">Weight: ${weight}</p>
    <p class="type">Type: <span>${type}</span> </p>
    </div>
  `;

  pokemonEl.appendChild(pokemonBackEl);


  pokemonGallery.appendChild(pokemonEl);

  function flipCard() {
    const p = this.closest('.pokemon');
    p.querySelector('.front').classList.toggle('flipped');
    p.querySelector('.back').classList.toggle('flipped');
  }
  pokemonFrontEl.addEventListener("click", flipCard);
  pokemonBackEl.addEventListener("click", flipCard);

}