const pokemonGallery = document.getElementById("pokemon-gallery")
const getPokemon = () => {
  const promises = []
  for (let i = 1; i <= 20; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`
    promises.push(fetch(url).then(res => res.json()))
  }
  Promise.all(promises).then(results => {
    const pokemon = results.map(result => ({
      id: result.id,
      name: result.name,
      height: result.height,
      weight: result.weight,
      type: result.types.map((type) => type.type.name).join(', '),
      image: result.sprites["front_default"],
    }))
    displayPokemon(pokemon)
  })
}
const displayPokemon = pokemon => {
    console.log(pokemon)
  const pokemonString = pokemon
    .map(
      pokemon => `
    <div>
      <img src="${pokemon.image}" />
      <h3>${pokemon.id}.${pokemon.name.toUpperCase()}</h3>
      <p> Height: ${pokemon.height} </p>
      <p> Weight: ${pokemon.weight}</p>
      <p> Types: ${pokemon.type}</p>
    </div>`
    )
    .join("")
  pokemonGallery.innerHTML = pokemonString
}
getPokemon()