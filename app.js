const pokemonGallery = document.getElementById("pokemon-gallery");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");


const loader = document.getElementById("loading");


let limit = 19;
let offset = 1;



prevBtn.addEventListener('click', ()=> {
  if( offset > 1){
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

const fetchPokemons = async () => {
  loader.style.display = "block";
  for (let i = offset; i <=offset + limit; i++) {
    await getPokemon(i);
  }
};

const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  loader.style.display = "none";
    createPokemonCard(data)
};



function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons();

const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div");
  const pokemonElBack = document.createElement('div');
  pokemonEl.classList.add("pokemon");
  // console.log(pokemon)

  const name = pokemon.name.toUpperCase();
  const img = pokemon.sprites.front_default;
  const id = pokemon.id.toString().padStart(3, 0);
  const height = (pokemon.height/10).toFixed(1) + "m";
  const weight = (pokemon.weight/10) + "kg";
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