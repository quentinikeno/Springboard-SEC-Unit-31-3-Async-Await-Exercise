// Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number.
const NUMBERS_API_BASE_URL = "http://numbersapi.com/";
const favNumber = 42;
const favNumberURL = `${NUMBERS_API_BASE_URL}${favNumber}?json`;

axios
	.get(favNumberURL)
	.then((response) => console.log(response.data.text))
	.catch((err) => console.log(err));

// Figure out how to get data on multiple numbers in a single request. Make that request and when you get the data back, put all of the number facts on the page.
const fourPromises = Array();
const numbers = [94, 27, 21, 64];

for (let num of numbers) {
	fourPromises.push(axios.get(`${NUMBERS_API_BASE_URL}${num}?json`));
}

Promise.all(fourPromises)
	.then((respArray) =>
		respArray.forEach((resp) => console.log(resp.data.text))
	)
	.catch((err) => console.log(err));

// Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page. It’s okay if some of the facts are repeats.
const fourFavPromises = [];
factList = document.querySelector("ul");

for (let i = 0; i < 4; i++) {
	fourFavPromises.push(axios.get(favNumberURL));
}

Promise.all(fourFavPromises)
	.then((respArray) =>
		respArray.forEach((resp) => {
			const li = document.createElement("li");
			li.textContent = resp.data.text;
			factList.append(li);
			console.log(li);
		})
	)
	.catch((err) => console.log(err));
