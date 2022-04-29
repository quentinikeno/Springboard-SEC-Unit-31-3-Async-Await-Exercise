const baseURL = "https://pokeapi.co/api/v2/";
const $pokemonDiv = $("#pokemonDiv");
const $button = $(".button");

$button.on("click", showPokemon);

async function showPokemon() {
	try {
		let names = [];
		let descriptions = [];
		let imageURLs = [];
		let speciesPromises = [];

		let { data: allData } = await axios.get(
			`${baseURL}pokemon/?limit=100000&offset=0`
		);
		let randPokemon = allData.results
			.sort(() => 0.5 - Math.random())
			.slice(0, 3)
			.map((result) => {
				return axios.get(result.url);
			});
		let pokemonData = await Promise.all(randPokemon);
		for (pokemon of pokemonData) {
			imageURLs.push(pokemon.data.sprites.front_default);
			names.push(pokemon.data.name);
			speciesPromises.push(axios.get(pokemon.data.species.url));
		}
		let speciesData = await Promise.all(speciesPromises);
		descriptions = speciesData.map((pokemon) => {
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
	} catch (err) {
		console.log(err);
	}
}
