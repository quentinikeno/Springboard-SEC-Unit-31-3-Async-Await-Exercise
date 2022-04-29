// Make a request to the Deck of Cards API to request a single card from a newly shuffled deck.
// axios
const baseURL = "http://deckofcardsapi.com/api/";

async function drawOneCard() {
	try {
		let { data: deckData } = await axios.get(
			`${baseURL}deck/new/shuffle/?deck_count=1`
		);
		const deck_id = deckData.deck_id;
		let { data } = await axios.get(`${baseURL}deck/${deck_id}/draw`);
		let { value, suit } = data.cards[0];
		console.log(value.toLowerCase(), "of", suit.toLowerCase());
	} catch (e) {
		console.log(e);
	}
}

drawOneCard();

// Make a request to the deck of cards API to request a single card from a newly shuffled deck.
// Once you have the card, make a request to the same API to get one more card from the same deck.

async function drawTwoCards() {
	try {
		let { data: deckData } = await axios.get(
			`${baseURL}deck/new/shuffle/?deck_count=1`
		);
		const deck_id = deckData.deck_id;
		let responses = await Promise.all([
			await axios.get(`${baseURL}deck/${deck_id}/draw`),
			await axios.get(`${baseURL}deck/${deck_id}/draw`),
		]);
		for (response of responses) {
			let { data } = response;
			let { value, suit } = data.cards[0];
			console.log(value.toLowerCase(), "of", suit.toLowerCase());
		}
	} catch (e) {
		console.log(e);
	}
}

drawTwoCards();

// Build an HTML page that lets you draw cards from a deck.
const $drawBtn = $("#draw-btn");
const $drawPile = $("#draw-pile");

class Deck {
	constructor() {
		this.init();
		this.drawCard = this.drawCard.bind(this);
	}
	async init() {
		let { data } = await axios.get(
			`${baseURL}deck/new/shuffle/?deck_count=1`
		);
		this.deck_id = data.deck_id;
		$drawBtn.show();
		$drawBtn.on("click", this.drawCard);
	}
	async drawCard() {
		let { data } = await axios.get(
			`http://deckofcardsapi.com/api/deck/${this.deck_id}/draw/`
		);
		this.addCard(data);
	}
	addCard(data) {
		let randomAngle = Math.random() * 90 - 45;
		let randomX = Math.random() * 40 - 20;
		let randomY = Math.random() * 40 - 20;
		let src = data.cards[0].image;
		let $img = $("<img>", {
			src: src,
			css: {
				transform: `translate(${randomX}px, ${randomY}px) rotate(${randomAngle}deg)`,
			},
		});
		$drawPile.append($img);
		if (data.remaining === 0) {
			$drawBtn.hide();
		}
	}
}

new Deck();
