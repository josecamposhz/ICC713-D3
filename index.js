const apiURL = 'https://pokeapi.co/api/v2/pokemon';

let pokemones = [];
let misPokemones = [];

const drawApp = () => {
  document.getElementById("app").innerHTML = `
    <h1 class="text-center pt-2">Mis pokemones</h1>
      <div class="d-flex p-3">
        <div class="col-xs-2 col-md-4">
            <ol id="lista-pokemones"></ol>
        </div>
        <div class="col-xs-10 col-md-8">
          <div id="pokemon-card" class="d-flex flex-wrap"></div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    </div>
  `
};

const getPokemones = async () => {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();
    pokemones = data.results;
    crearLista();
  } catch (error) {
    console.log(error);
  }
};


drawApp();
getPokemones();

const addPokemon = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const { name } = data;
    const { front_default } = data.sprites;
    const stats = data.stats.map(stat => {
      return {
        name: stat.stat.name,
        base_stat: stat.base_stat
      }
    });
    crearPokemonCard(name, stats, front_default);
  } catch (error) {
    console.log(error);
  }
};

// innerHTML y Template String
const crearLista = () => {
  document.getElementById("lista-pokemones").innerHTML = pokemones.map(pokemon => `
  <li class="mb-2">${pokemon.name} <button class="btn btn-info ml-2" onclick="addPokemon('${pokemon.url.toString()}');">Agregar</button></li>`).join('');
}

const crearPokemonCard = (name, stats, imageSrc) => {
  misPokemones.push({
    name,
    imageSrc,
    stats
  });

  misPokemonesCards();
}

const misPokemonesCards = () => {
  document.getElementById("pokemon-card").innerHTML = misPokemones.map((pokemon, i) => `
    <div class="col-xs-12 col-md-6 mb-2">
      <div class="card">
        <div class="card-body">
          <h4 class="text-center">${pokemon.name}</h4>
          <div class="d-flex flex-wrap align-items-center">
            <div class="col-sm-12 col-md-6">
              <img class="card-img-top" style="max-height: 200px; max-width: 200px;" src="${pokemon.imageSrc}" alt="${pokemon.name}">
            </div>
            <div class="col-sm-12 col-md-6">
              <div class="card-text">
                ${pokemon.stats.map(stat => `<div><strong>${stat.name}: </strong><span>${stat.base_stat}</span></div>`).join('')}
                <div class="d-flex justify-content-center">
                  <button class="btn btn-danger" onclick="deleteCard(${i})">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`).join('');
}

const deleteCard = (index) => {
  misPokemones.splice(index, 1);
  misPokemonesCards();
}