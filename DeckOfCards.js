// Make a request to the Deck of Cards API to request a single card from a newly shuffled deck.
axios
	.get("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
	.then((res) =>
		axios.get(
			`http://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/`,
			{ params: { count: 1 } }
		)
	)
	.then((res) =>
		console.log(res.data.cards[0].value, " of ", res.data.cards[0].suit)
	)
	.catch((err) => console.log(err));

// Make a request to the deck of cards API to request a single card from a newly shuffled deck.
// Once you have the card, make a request to the same API to get one more card from the same deck.
axios
	.get("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
	.then((res) =>
		axios.get(
			`http://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/`,
			{ params: { count: 1 } }
		)
	)
	.then((res) => {
		console.log(res.data.cards[0].value, " of ", res.data.cards[0].suit);
		return axios.get(
			`http://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/`,
			{ params: { count: 1 } }
		);
	})
	.then((res) =>
		console.log(res.data.cards[0].value, " of ", res.data.cards[0].suit)
	)
	.catch((err) => console.log(err));

// Build an HTML page that lets you draw cards from a deck.
let deck_id = null;
const $drawBtn = $("#draw-btn");
const $drawPile = $("#draw-pile");

axios
	.get("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
	.then((res) => {
		deck_id = res.data.deck_id;
		$drawBtn.show();
		$drawBtn.on("click", drawCard);
	})
	.catch((err) => console.log(err));

function drawCard() {
	axios
		.get(`http://deckofcardsapi.com/api/deck/${deck_id}/draw/`, {
			params: { count: 1 },
		})
		.then((res) => {
			addCard(res);
		})
		.catch((err) => console.log(err));
}

function addCard(res) {
	let randAngle = Math.random() * 90 - 45;
	let src = res.data.cards[0].image;
	let $img = $("<img>", {
		src: src,
		css: {
			transform: `rotate(${randAngle}deg)`,
		},
	});
	$drawPile.append($img);
	if (res.data.remaining === 0) {
		$drawBtn.hide();
	}
}
