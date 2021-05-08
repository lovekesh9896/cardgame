class Card {
	constructor(symbol, value, color, owner) {
		this.symbol = symbol;
		this.value = value;
		this.color = color;
		this.owner = owner;
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
let symbols = ["♠", "♥", "♣", "♦"];
let numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

function createCards() {
	cards = [];
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

function cardsSort(card1, card2) {
	if (symbols.indexOf(card1.symbol) < symbols.indexOf(card2.symbol)) {
		return -1;
	}
	if (symbols.indexOf(card1.symbol) > symbols.indexOf(card2.symbol)) {
		return 1;
	}
	if (card1.value < card2.value) {
		return -1;
	} else if (card1.value > card2.value) {
		return 1;
	}
	return 0;
}

function printCards(cards) {
	console.log(cards);
	let cardHTMLString = `<div class="card">
                            <span class="symbol"></span>
                            <span class="value"></span>
                        </div>`;

	let cardContainer = document.getElementById("cards");
	cardContainer.innerHTML = "";
	for (let i = 0; i < cards.length; i++) {
		$(cardContainer).append(cardHTMLString);
	}
	let htmlCards = document
		.getElementById("cards")
		.getElementsByClassName("card");

	cards.sort(cardsSort);
	cards.forEach((card, index) => {
		htmlCards[index].getElementsByClassName("symbol")[0].innerText =
			card.symbol;
		htmlCards[index].getElementsByClassName(
			"value"
		)[0].innerText = card.getValue();
		htmlCards[index].style.color = card.color;
	});
	handleCardClick();
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

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

	console.log(card1, card2, card3, card4);
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

let connected = false;
const socket = io(window.location.href);
// broadcasted messages
socket.on("connection");

// players joining
let namebtn = document.getElementById("start-game");
let getNameInput = document.getElementById("player-name");
let playerCount = document.getElementById("players-online");
let currPlayersName = document.getElementById("players-name");
namebtn.addEventListener("click", () => {
	if (!connected) {
		let name = getNameInput.value;
		socket.emit("new player", name);
		connected = true;
		let h3String = `<h3>you</h3>`;
		currPlayersName.innerHTML = currPlayersName.innerHTML + h3String;
		playerCount.innerText = parseInt(playerCount.innerText) + 1;
		if (playerCount.innerText == 4) {
			createCards();
			shuffle(cards);
			const data = JSON.stringify({ cards: cards });
			socket.emit("starting game", data);
			cards = cards.slice(39, 52);
			for (let i = 0; i < cards.length; i++) {
				cards[i].owner = name;
			}
			printCards(cards);
			startTheGame();
			createMessage();
		}
	}
});
function print() {
	console.log(cards);
}
socket.on("starting game", (data) => {
	console.log(data);
	data = JSON.parse(data);
	cards = data.cards;

	let position = 0;
	let h3InPlayers = currPlayersName.getElementsByTagName("h3");

	for (let i = 0; i < h3InPlayers.length; i++) {
		let name = h3InPlayers[i].innerText;
		if (name == "you") {
			position = i + 1;
		}
	}

	switch (position) {
		case 1:
			cards = cards.slice(0, 13);
			break;
		case 2:
			cards = cards.slice(13, 26);
			break;
		case 3:
			cards = cards.slice(26, 39);
			break;
		case 4:
			cards = cards.slice(39, 52);
	}
	let newCards = [];

	cards.forEach((card) => {
		newCards.push(
			new Card(card.symbol, card.value, card.color, getNameInput.value)
		);
	});
	printCards(newCards);
	cards = newCards;
	startTheGame();
	createMessage();
});

socket.on("new player", (data) => {
	playerCount.innerText = data.split(",")[0];
	let name = data.split(",")[1];

	let h3String = `<h3>${name}</h3>`;
	currPlayersName.innerHTML = currPlayersName.innerHTML + h3String;
});

// starting game

function startTheGame() {
	setPlayerNames();
	$("#screen1").html("");
	$("#screen1").append('<div class="loader"></div>');

	setTimeout(() => {
		$("#screen1").append("<h3>Starting Game...</h3>");
	}, 1000);
	setTimeout(() => {
		$("#screen1").append("<h3>Shuffling the cards...</h3>");
	}, 2000);

	// printCards(cards);

	setTimeout(() => {
		$("#screen1").slideUp();
		console.log(cards);
	}, 3000);
}

let players = [];
let currName = "";
function setPlayerNames() {
	let h3InPlayers = currPlayersName.getElementsByTagName("h3");
	let tableHeader = document.getElementsByTagName("th");
	for (let i = 0; i < h3InPlayers.length; i++) {
		let name = h3InPlayers[i].innerText;
		console.log(name);
		if (name == "you") {
			players.push(getNameInput.value);
			currName = getNameInput.value;
			tableHeader[i].innerText = currName;
			currScoreMap[currName] = 0;
		} else {
			players.push(name);
			tableHeader[i].innerText = name;
			currScoreMap[name] = 0;
		}
	}
	console.log(players);
}

let playerIndex = 3;
let currCards = 0;
let cardsToCompare = [];
let bolLo = 0;

let currScoreMap = new Map();

let player1Score = [];
let player2Score = [];
let player3Score = [];
let player4Score = [];

let totalCardsDrawn = 0;

function createMessage(card) {
	let messageString;
	if (currCards == 4) {
		messageString = `${card.owner} won`;
	} else if (bolLo < 4) {
		messageString = `${players[playerIndex]} bhai bol le`;
	} else {
		messageString = `Waiting for ${players[playerIndex]} to draw card`;
	}
	console.log(messageString);

	message.innerText = messageString;
}
let message = document.getElementById("message");
// io player names

// placing bet
let bolleInput = document.getElementById("bolle-input");
let boleleSubmit = document.getElementById("bolle-submit");

boleleSubmit.addEventListener("click", () => {
	if (bolleInput.value != "") {
		socket.emit(
			"bet placed",
			JSON.stringify({ name: currName, bet: bolleInput.value })
		);
		bolLo++;
		playerIndex = (playerIndex + 1) % 4;
		createMessage();
		playerIn = players.indexOf(currName);
		let htmltd = document.getElementsByTagName("td");
		htmltd[playerIn].innerText = bolleInput.value;
	}
});

socket.on("bet placed", (data) => {
	data = JSON.parse(data);
	playerIn = players.indexOf(data.name);
	let htmltd = document.getElementsByTagName("td");
	htmltd[playerIn].innerText = data.bet;
	bolLo++;
	playerIndex = (playerIndex + 1) % 4;
	createMessage();
});

function findCard(cardToFind) {
	for (let i = 0; i < cards.length; i++) {
		if (
			cards[i].symbol ==
				cardToFind.getElementsByClassName("symbol")[0].innerText &&
			cards[i].getValue() ==
				cardToFind.getElementsByClassName("value")[0].innerText
		) {
			return cards[i];
		}
	}
}

function cardsHoverAnim(card) {
	card.classList.add("cardAnim");
}

function letTableHistoryString() {
	let tableHeader = document
		.getElementById("curr")
		.getElementsByTagName("td");
	let str1 = "<tr>";
	for (let i = 0; i < players.length; i++) {
		let score = currScoreMap[players[i]];
		let expected = parseInt(tableHeader[i].innerText);
		console.log(players[i], score, expected);
		str1 += `<td>${score >= expected ? expected : -expected}</td>`;
	}
	str1 += "</tr>";

	return str1;
}

function handleCardClick() {
	let htmlcards = document
		.getElementById("cards")
		.getElementsByClassName("card");
	let playgroundCards = document
		.getElementById("playground")
		.getElementsByClassName("card");

	for (let i = 0; i < htmlcards.length; i++) {
		htmlcards[i].addEventListener("mouseover", (e) => {
			cardsHoverAnim(htmlcards[i]);
		});
		htmlcards[i].addEventListener("mouseout", (e) => {
			htmlcards[i].classList.remove("cardAnim");
		});
		htmlcards[i].addEventListener("click", () => {
			if (players[playerIndex] != getNameInput.value) {
				window.alert("please wait for your turn");
				return;
			}
			let card = findCard(htmlcards[i]);
			console.log(card);
			playgroundCards[currCards].getElementsByClassName(
				"symbol"
			)[0].innerText = card.symbol;
			playgroundCards[currCards].getElementsByClassName(
				"value"
			)[0].innerText = card.getValue();
			playgroundCards[currCards].style.color = card.color;

			// htmlcards[htmlcards.length - 1].remove();
			cards = cards.filter((item) => item != card);
			printCards(cards);

			currCards++;
			playerIndex = (playerIndex + 1) % 4;

			cardsToCompare.push(card);

			if (cardsToCompare.length == 4) {
				let winCard = whoWon(
					cardsToCompare[0],
					cardsToCompare[1],
					cardsToCompare[2],
					cardsToCompare[3]
				);
				console.log("card won");
				winCard.print();
				console.log(winCard);
				createMessage(winCard);
				playerIndex = players.indexOf(winCard.owner);
				currCards = 0;
				cardsToCompare = [];

				currScoreMap[winCard.owner] = currScoreMap[winCard.owner] + 1;
				totalCardsDrawn++;
				if (totalCardsDrawn == 13) {
					console.log("game over");
					console.log(currScoreMap);

					let tableHistoryString = letTableHistoryString();
					console.log(tableHistoryString);
					$($("#history tbody")[0]).append(tableHistoryString);

					createCards();
					shuffle(cards);
					const data = JSON.stringify({ cards: cards });
					socket.emit("starting game", data);
					let position = 0;
					let h3InPlayers = currPlayersName.getElementsByTagName(
						"h3"
					);

					for (let i = 0; i < h3InPlayers.length; i++) {
						let name = h3InPlayers[i].innerText;
						if (name == "you") {
							position = i + 1;
						}
					}

					switch (position) {
						case 1:
							cards = cards.slice(0, 13);
							break;
						case 2:
							cards = cards.slice(13, 26);
							break;
						case 3:
							cards = cards.slice(26, 39);
							break;
						case 4:
							cards = cards.slice(39, 52);
					}
					for (let i = 0; i < cards.length; i++) {
						cards[i].owner = name;
					}
					printCards(cards);
					$("#screen1").slideDown();
					startTheGame();
					createMessage();
				}

				setTimeout(() => {
					for (let i = 0; i < 4; i++) {
						playgroundCards[i].getElementsByClassName(
							"symbol"
						)[0].innerText = "_";
						playgroundCards[i].getElementsByClassName(
							"value"
						)[0].innerText = "_";
						playgroundCards[i].getElementsByClassName(
							"owner"
						)[0].innerText = "_";
					}
					createMessage();
				}, 4000);
			} else {
				createMessage();
			}

			socket.emit("card drawn", JSON.stringify(card));
		});
	}
}

let playgroundCards = document
	.getElementById("playground")
	.getElementsByClassName("card");

socket.on("card drawn", (card) => {
	console.log(card);
	tempCard = JSON.parse(card);
	card = new Card(
		tempCard.symbol,
		tempCard.value,
		tempCard.color,
		tempCard.owner
	);
	cardsToCompare.push(card);

	playgroundCards[currCards].getElementsByClassName("symbol")[0].innerText =
		card.symbol;
	playgroundCards[currCards].getElementsByClassName(
		"value"
	)[0].innerText = card.getValue();
	playgroundCards[currCards].style.color = card.color;
	playgroundCards[currCards].getElementsByClassName("owner")[0].innerText =
		card.owner;

	currCards++;
	console.log(playerIndex);
	playerIndex = (playerIndex + 1) % 4;
	console.log(playerIndex);

	if (cardsToCompare.length == 4) {
		let winCard = whoWon(
			cardsToCompare[0],
			cardsToCompare[1],
			cardsToCompare[2],
			cardsToCompare[3]
		);
		console.log("card won");
		winCard.print();
		console.log(winCard);
		createMessage(winCard);
		playerIndex = players.indexOf(winCard.owner);
		currCards = 0;
		cardsToCompare = [];

		currScoreMap[winCard.owner] = currScoreMap[winCard.owner] + 1;
		totalCardsDrawn++;
		if (totalCardsDrawn == 13) {
			console.log("game over");
			console.log(currScoreMap);

			let tableHistoryString = letTableHistoryString();
			console.log(tableHistoryString);
			$($("#history tbody")[0]).append(tableHistoryString);
		}

		setTimeout(() => {
			for (let i = 0; i < 4; i++) {
				playgroundCards[i].getElementsByClassName(
					"symbol"
				)[0].innerText = "_";
				playgroundCards[i].getElementsByClassName(
					"value"
				)[0].innerText = "_";
				playgroundCards[i].getElementsByClassName(
					"owner"
				)[0].innerText = "_";
			}
			createMessage();
		}, 4000);
	} else {
		createMessage();
	}
});

// handleCardClick();

// remove after test

window.addEventListener("keyup", (e) => {
	if (e.code == "Enter") {
		namebtn.click();
	}
});
