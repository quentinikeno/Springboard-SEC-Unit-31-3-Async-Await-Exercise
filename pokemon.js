const baseURL = "https://pokeapi.co/api/v2/";
const $pokemonDiv = $("#pokemonDiv");
const $button = $(".button");
let names = null;
let descriptions = null;
let imageURLs = null;

function showPokemon() {
	axios
		.get(`${baseURL}pokemon/?limit=100000&offset=0`)
		.then((resp) => {
			randPokemon = resp.data.results
				.sort(() => 0.5 - Math.random())
				.slice(0, 3)
				.map((result) => {
					return axios.get(result.url);
				});
			return Promise.all(randPokemon);
		})
		.then((resp) => {
			imageURLs = resp.map(
				(pokemon) => pokemon.data.sprites.front_default
			);
			names = resp.map((pokemon) => pokemon.data.name);
			species = resp.map((pokemon) =>
				axios.get(pokemon.data.species.url)
			);
			return Promise.all(species);
		})
		.then((resp) => {
			descriptions = resp.map((pokemon) => {
				let flavorTextObj = pokemon.data.flavor_text_entries.find(
					(entry) => entry.language.name === "en"
				);
				return flavorTextObj
					? flavorTextObj.flavor_text
					: "No description.";
			});
			$pokemonDiv.empty();
			names.forEach((name, i) => {
				$card = $(`
            <div class="column">
                <div class="card">
                    <div class="card-image">
                        <figure class="image is-128x128 is-rounded">
                            <img class="card-image" src=${imageURLs[i]}>
                        </figure>
                    </div>
                    <div class="card-content">
                        <h2 class="title is-4">${name}</h2>
                        <p class="content">${descriptions[i]}</p>
                    </div>
                </div>
            </div>`);
				$pokemonDiv.append($card);
			});
		})
		.catch((err) => console.log(err));
}

$button.on("click", showPokemon);
