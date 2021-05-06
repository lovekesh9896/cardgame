class Player {
	constructor(name) {
		this.name = name;
		this.cards = [];
	}
}

class Card {
	constructor(symbol, value, color) {
		this.symbol = symbol;
		this.value = value;
		this.color = color;
	}

	print() {
		switch (this.value) {
			case 14:
				console.log(`${this.symbol} A`);
				break;
			case 11:
				console.log(`${this.symbol} J`);
				break;
			case 12:
				console.log(`${this.symbol} Q`);
				break;
			case 13:
				console.log(`${this.symbol} K`);
				break;
			default:
				console.log(`${this.symbol} ${this.value}`);
				break;
		}
	}

	getValue() {
		switch (this.value) {
			case 14:
				return "A";
			case 11:
				return "J";
			case 12:
				return "Q";
			case 13:
				return "K";
			default:
				return this.value;
		}
	}
}

let cards = [];
let symbols = ["♠", "♣", "♥", "♦"];
let numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

function createCards() {
	symbols.forEach((symbol) => {
		numbers.forEach((value) => {
			if (symbol == "♥" || symbol == "♦") {
				cards.push(new Card(symbol, value, "red"));
			} else {
				cards.push(new Card(symbol, value, "black"));
			}
		});
	});
}

let htmlCards = document.getElementById("cards").getElementsByClassName("card");

function printCards() {
	cards.forEach((card, index) => {
		htmlCards[index].getElementsByClassName("symbol")[0].innerText =
			card.symbol;
		htmlCards[index].getElementsByClassName(
			"value"
		)[0].innerText = card.getValue();
		htmlCards[index].style.color = card.color;
	});
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

let button = document.getElementById("shuffel");

createCards();
// printCards();

const trump = symbols[0];

function maxValue(card1, card2) {
	return card1.value > card2.value ? card1 : card2;
}

function whoWon(card1, card2, card3, card4) {
	let cardWon = card1;
	// card2
	if (card2.symbol == cardWon.symbol) {
		cardWon = maxValue(cardWon, card2);
	} else if (cardWon.symbol != trump && card2.symbol == trump) {
		cardWon = card2;
	}
	// card3
	if (card3.symbol == cardWon.symbol) {
		cardWon = maxValue(cardWon, card3);
	} else if (cardWon.symbol != trump && card3.symbol == trump) {
		cardWon = card3;
	}
	// card4
	if (card4.symbol == cardWon.symbol) {
		cardWon = maxValue(cardWon, card4);
	} else if (cardWon.symbol != trump && card4.symbol == trump) {
		cardWon = card4;
	}

	return cardWon;
}

function getRandomCard(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function testWhoWon() {
	let card1 = getRandomCard(cards);
	let card2 = getRandomCard(cards);
	let card3 = getRandomCard(cards);
	let card4 = getRandomCard(cards);

	let winCard = whoWon(card1, card2, card3, card4);

	console.log("cards were");
	card1.print();
	card2.print();
	card3.print();
	card4.print();

	console.log("card won");
	winCard.print();

	let tempCards = [card1, card2, card3, card4];
	let matchCards = document
		.getElementById("match")
		.getElementsByClassName("card");

	for (let i = 0; i < 4; i++) {
		matchCards[i].getElementsByClassName("symbol")[0].innerText =
			tempCards[i].symbol;
		matchCards[i].getElementsByClassName("value")[0].innerText = tempCards[
			i
		].getValue();
		matchCards[i].style.color = tempCards[i].color;

		if (
			tempCards[i].symbol == winCard.symbol &&
			tempCards[i].value == winCard.value
		) {
			matchCards[i].style.border = "4px solid green";
			matchCards[i].style.boxShadow = "none";
		}
	}
}

button.addEventListener("click", () => {
	shuffle(cards);
	printCards();
	testWhoWon();
});
