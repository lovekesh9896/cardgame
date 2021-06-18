// card class
class Card {
	constructor(symbol, value, color, owner) {
		this.symbol = symbol;
		this.value = value;
		this.color = color;
		this.owner = owner;
		this.id = uuidv4();
	}

	printCard() {
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

class Player {
	constructor(name) {
		this.name = name;
		this.id = uuidv4();
		this.currBid = 0;
		this.prevScores = [];
		this.totalScore = 0;
		this.currScore = 0;
		this.position = playersClassArr.length + 1;
	}

	updateScore() {
		if (tempScore >= this.currBid) {
			this.prevScores.push(this.currBid);
			this.totalScore += this.totalScore;
		} else {
			this.prevScores.push(-this.prevScores);
			this.totalScore -= this.totalScore;
		}
	}
}

// global variables
let cards = [];
let symbols = ["♠", "♥", "♣", "♦"];
let numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const trump = symbols[0];
let areYouAlreadyConnected = false; // to handle multiple click on start game button
// let players = [];
let currPlayerName = "";
let playerIndex = 3;
let currCards = 0;
let cardsToCompare = [];
let bolLo = 0;

let totalCardsDrawn = 0;

// for new code
let playersClassArr = [];
let currPlayer = null;

// global HTML imports
let namebtn = document.getElementById("start-game");
let getNameInput = document.getElementById("player-name");
let playerCount = document.getElementById("players-online");
let currPlayersName = document.getElementById("players-name");
let message = document.getElementById("message");
let bolleInput = document.getElementById("bolle-input");
let boleleSubmit = document.getElementById("bolle-submit");
let playgroundCards = document
	.getElementById("actual-playground")
	.getElementsByClassName("card");

function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);
}

function createPlayersWhenPageLoads() {
	let h3 = currPlayersName.getElementsByTagName("h3");
	for (let i = 0; i < h3.length; i++) {
		console.log(h3[i]);
		playersClassArr.push(new Player(h3[i].innerText));
	}
}

createPlayersWhenPageLoads();

function findPlayerFromPlayerClassArr(name) {
	for (let i = 0; i < 4; i++) {
		if (playersClassArr[i].name == name) {
			return playersClassArr[i];
		}
	}
	return playersClassArr[0];
}

function createCards() {
	// empty cards array because we need it for new match
	let cardsArr = [];
	// loop through symbol and numbers array to fill the cards array
	symbols.forEach((symbol) => {
		numbers.forEach((value) => {
			if (symbol == "♥" || symbol == "♦") {
				cardsArr.push(new Card(symbol, value, "red", currPlayerName));
			} else {
				cardsArr.push(new Card(symbol, value, "black", currPlayerName));
			}
		});
	});

	return cardsArr;
}

function cardsSort(card1, card2) {
	// first sort by symbol and then by value
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
	// HTML of how a card should look like
	let cardHTMLString = `<div class="card">
                            <span class="symbol"></span>
                            <span class="value"></span>
                        </div>`;

	// empty card container and create cards on DOM equal to cards length
	let cardContainer = document.getElementById("cards");
	cardContainer.innerHTML = "";
	for (let i = 0; i < cards.length; i++) {
		$(cardContainer).append(cardHTMLString);
	}
	let htmlCards = document
		.getElementById("cards")
		.getElementsByClassName("card");

	// sort card before printing
	cards.sort(cardsSort);
	// print all the cards and initiate event listners again because prev cards are destroyed
	cards.forEach((card, index) => {
		htmlCards[index].getElementsByClassName("symbol")[0].innerText =
			card.symbol;
		htmlCards[index].getElementsByClassName("value")[0].innerText =
			card.getValue();
		htmlCards[index].style.color = card.color;
		htmlCards[index].setAttribute("data-id", card.id);
	});
	addLeftToCards();

	handleCardClick();
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

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

const socket = io(window.location.href);
socket.on("connection");
// broadcasted messages

function setPlayerNames() {
	let playerNamesInHtml = document.getElementsByClassName("player-name");
	let j = 0;
	for (let i = 0; i < playerNamesInHtml.length; i++) {
		console.log(i, j);
		if (playersClassArr[j] != currPlayer) {
			playerNamesInHtml[i].innerText = playersClassArr[j].name;
			j++;
		} else {
			j++;
			i--;
		}
	}
	printPlayerNamesOnScoreCradsHtml();
	console.log(playersClassArr);
}

function startTheGame() {
	$("#screen1").slideDown();

	// $("#screen1").html("");
	// $("#screen1").append('<div class="loader"></div>');

	// setTimeout(() => {
	// 	$("#screen1").append("<h3>Starting Game...</h3>");
	// }, 1000);
	// setTimeout(() => {
	// 	$("#screen1").append("<h3>Shuffling the cards...</h3>");
	// }, 2000);

	// $("#place-bet-container").slideDown();

	// setTimeout(() => {
	$("#screen1").slideUp();
	// }, 3000);
}

function printPlayerNameOnScreen1() {
	currPlayersName.innerText = "";
	for (let i = 0; i < playersClassArr.length; i++) {
		if (currPlayer == playersClassArr[i]) {
			$(currPlayersName).append("<h3>You</h3>");
		} else {
			$(currPlayersName).append(`<h3>${playersClassArr[i].name}</h3>`);
		}
	}
}

namebtn.addEventListener("click", () => {
	namebtn.disabled = true;
	currPlayerName = getNameInput.value;

	socket.emit("new player", currPlayerName);

	currPlayer = new Player(currPlayerName);
	playersClassArr.push(currPlayer);
	playerCount.innerText = playersClassArr.length;
	printPlayerNameOnScreen1();

	if (playersClassArr.length == 4) {
		// abcd
		setPlayerNames();
		let AllCards = createCards();
		shuffle(AllCards);
		socket.emit("starting game", JSON.stringify({ cards: AllCards }));
		cards = findCardsByPosition(currPlayer.position, AllCards);
		printCards(cards);
		startTheGame();
		createMessage();
	}
});

socket.on("starting game", (data) => {
	data = JSON.parse(data);
	let allCards = data.cards;

	setPlayerNames();

	yourCards = findCardsByPosition(currPlayer.position, allCards);
	let newCards = [];
	// convert them into Card class
	yourCards.forEach((card) => {
		newCards.push(
			new Card(card.symbol, card.value, card.color, getNameInput.value)
		);
	});
	printCards(newCards);
	cards = newCards;
	startTheGame();
	createMessage();
});

socket.on("new player", (name) => {
	playersClassArr.push(new Player(name));
	playerCount.innerText = playersClassArr.length;
	printPlayerNameOnScreen1();
});

function findCardsByPosition(position, cards) {
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
	return cards;
}

// starting game

function createMessage(card) {
	// let messageString;
	// if (currCards == 4) {
	// 	if (playersClassArr[playerIndex] == currPlayer) {
	// 		messageString = `You won`;
	// 	} else {
	// 		messageString = `${card.owner} won`;
	// 	}
	// } else {
	// 	if (playersClassArr[playerIndex] == currPlayer) {
	// 		messageString = `Waiting for you to draw card`;
	// 	} else {
	// 		messageString = `Waiting for ${playersClassArr[playerIndex].name} to draw card`;
	// 	}
	// }
	// message.innerText = messageString;
}

function updatePlayersCurrBidInHtml() {
	let htmltd = document.getElementsByTagName("td");
	playersClassArr.forEach((player, index) => {
		htmltd[index].innerText = player.currBid;
	});
}

function printPlayerNamesOnScoreCradsHtml() {
	let htmlth = document.getElementsByTagName("th");
	for (let i = 0; i < htmlth.length; i++) {
		htmlth[i].innerText = playersClassArr[i % 4].name;
	}
}

boleleSubmit.addEventListener("click", () => {
	if (bolleInput.value != "") {
		if (bolleInput.value < 2) {
			window.alert("Bet Should be atleast 2");
			return;
		}
		socket.emit(
			"bet placed",
			JSON.stringify({ name: currPlayerName, bet: bolleInput.value })
		);

		$("#place-bet-container").slideUp();
		currPlayer.currBid = parseInt(bolleInput.value);
		updatePlayersCurrBidInHtml();
	}
});

socket.on("bet placed", (data) => {
	data = JSON.parse(data);

	let playerFromClass = findPlayerFromPlayerClassArr(data.name);
	playerFromClass.currBid = parseInt(data.bet);

	updatePlayersCurrBidInHtml();
});

function findCard(cardToFind) {
	for (let i = 0; i < cards.length; i++) {
		if (cards[i].id == cardToFind.dataset.id) {
			return cards[i];
		}
	}
}

function resetGameScores() {
	// reset Players
	for (let i = 0; i < playersClassArr.length; i++) {
		let expected = playersClassArr[i].currBid;
		let score = playersClassArr[i].currScore;
		let final = score >= expected ? expected : -expected;

		playersClassArr[i].prevScores.push(final);
		playersClassArr[i].currBid = 0;
		playersClassArr[i].totalScore += final;
		playersClassArr[i].currScore = 0;
	}

	totalCardsDrawn = 0;
	playerIndex = 3;
	cardsToCompare = [];

	// add match score to history table
	let tableHistoryString = letTableHistoryString();
	$($("#history tbody")[0]).append(tableHistoryString);
}

function resetGame() {
	startTheGame();

	let AllCards = createCards();
	shuffle(AllCards);
	socket.emit("starting game", JSON.stringify({ cards: AllCards }));
	cards = findCardsByPosition(currPlayer.position, AllCards);

	printCards(cards);
	createMessage();
}

function resetPlayGroundCards(owner, myHtmlCard) {
	console.log(owner, myHtmlCard);
}

function updatePlaygroundCard(card) {
	let playerNamesInHtml = document.getElementsByClassName("player-name");

	for (let i = 0; i < playerNamesInHtml.length; i++) {
		if (playerNamesInHtml[i].innerText == card.owner) {
			playgroundCards[i].getElementsByClassName("symbol")[0].innerText =
				card.symbol;
			playgroundCards[i].getElementsByClassName("value")[0].innerText =
				card.getValue();
			playgroundCards[i].style.color = card.color;

			if (playgroundCards[i].classList.contains("hidden")) {
				playgroundCards[i].classList.remove("hidden");
			}
			playgroundCards[i].click();
		}
	}

	// playgroundCards[currCards].getElementsByClassName("owner")[0].innerText =
	// 	card.owner == currPlayer.name ? "You" : card.owner;

	currCards++;
	playerIndex = (playerIndex + 1) % 4;
}

function updateResultOf4Cards(myHtmlCard) {
	let winCard = whoWon(
		cardsToCompare[0],
		cardsToCompare[1],
		cardsToCompare[2],
		cardsToCompare[3]
	);
	createMessage(winCard);

	playerIndex = playersClassArr.findIndex(
		(item) => item.name == winCard.owner
	);
	currCards = 0;

	playersClassArr[playerIndex].currScore += 1;
	totalCardsDrawn++;

	setTimeout(() => {
		resetPlayGroundCards(winCard.owner, myHtmlCard);
		createMessage();
		cardsToCompare = [];
	}, 2000);
}

function letTableHistoryString() {
	updatePlayersCurrBidInHtml();
	let str1 = "<tr>";
	for (let i = 0; i < playersClassArr.length; i++) {
		str1 += `<td>${
			playersClassArr[i].prevScores[
				playersClassArr[i].prevScores.length - 1
			]
		}</td>`;
	}
	str1 += "</tr>";
	return str1;
}

function CreateNewPlaygroudCard(card, x, y) {
	let str = `<div class="card playground-special" style="left:${x}px;top:${y}px">
    <span class="symbol">${card.symbol}</span>
    <span class="value">${card.getValue()}</span>
</div>`;

	console.log(x, y);

	$(document.getElementsByTagName("body")[0]).append(str);
	console.log(
		document
			.getElementsByClassName("playground-special")[0]
			.getBoundingClientRect()
	);

	return document.getElementsByClassName("playground-special")[0];
}
let yourCrad = "";
function handleCardClick() {
	let htmlcards = document
		.getElementById("cards")
		.getElementsByClassName("card");

	for (let i = 0; i < htmlcards.length; i++) {
		htmlcards[i].addEventListener("click", () => {
			// if (playersClassArr[playerIndex] != currPlayer) {
			// 	window.alert("please wait for your turn");
			// 	return;
			// }
			// sometimes winner clicks the next card while playgrounds cards are not cleared.
			// this creates problem sometimes
			if (cardsToCompare.length == 4) {
				window.alert("please wait for others player to see score");
				return;
			}
			yourCrad = htmlcards[i];
			let card = findCard(htmlcards[i]);

			console.log(htmlcards[i].getBoundingClientRect());

			let x =
				window.innerWidth / 2 -
				htmlcards[i].getBoundingClientRect().x -
				50;
			let y =
				window.innerHeight / 2 -
				htmlcards[i].getBoundingClientRect().y -
				75;

			gsap.to(htmlcards[i], {
				rotate: 380,
				duration: 0.1,
				x: x + 90,
				y: y - 30,
			});

			socket.emit("card drawn", JSON.stringify(card));

			// updatePlaygroundCard(card);

			cardsToCompare.push(card);

			if (cardsToCompare.length == 4) {
				setTimeout(() => {
					let newCards = cards.filter((item) => item != card);
					printCards(newCards);
				}, 6000);

				updateResultOf4Cards(yourCrad);
				if (totalCardsDrawn == 3) {
					console.log("game over");
					resetGameScores();

					setTimeout(() => {
						resetGame();
					}, 6000);
				}
			} else {
				createMessage();
			}
		});
	}
}

socket.on("card drawn", (card) => {
	tempCard = JSON.parse(card);
	card = new Card(
		tempCard.symbol,
		tempCard.value,
		tempCard.color,
		tempCard.owner
	);
	cardsToCompare.push(card);

	console.log(yourCrad);
	updatePlaygroundCard(card);
	// let playerNamesInHtml = document.getElementsByClassName("player-name");

	// for (let i = 0; i < playerNamesInHtml.length; i++) {
	// 	if (playerNamesInHtml[i].innerText == card.owner) {
	// 		playgroundCards[i].click();
	// 	}
	// }

	if (cardsToCompare.length == 4) {
		setTimeout(() => {
			let newCards = cards.filter(
				(item) => item.id != yourCrad.dataset.id
			);
			printCards(newCards);
		}, 6000);

		updateResultOf4Cards(yourCrad);

		if (totalCardsDrawn == 3) {
			console.log("game over");
			resetGameScores();
		}
	} else {
		createMessage();
	}
});

// remove after test

window.addEventListener("keyup", (e) => {
	if (e.code == "Enter") {
		namebtn.click();
	}
});

// testing funtions
function getRandomCard(array) {
	return array[Math.floor(Math.random() * array.length)];
}

const testFunction = () => {
	function testWhoWon() {
		// select random cards
		let card1 = getRandomCard(cards);
		let card2 = getRandomCard(cards);
		let card3 = getRandomCard(cards);
		let card4 = getRandomCard(cards);

		// find who won
		let winCard = whoWon(card1, card2, card3, card4);

		console.log("cards were");
		card1.printCard();
		card2.printCard();
		card3.printCard();
		card4.printCard();

		// print the cards
		console.log("card won");
		winCard.printCard();
	}

	testWhoWon();
};

function automate() {
	let names = [
		"Harry",
		"Ross",
		"Bruce",
		"Cook",
		"Carolyn",
		"Morgan",
		"Albert",
		"Walker",
		"Randy",
		"Reed",
		"Larry",
		"Barnes",
		"Lois",
	];

	let name = getRandomCard(names);
	while (players.indexOf(name) != -1) {
		console.log(players.indexOf(name));
		name = getRandomCard(names);
	}
	getNameInput.value = name;
	namebtn.click();

	if (playerCount.innerText != 4) {
		window.open(window.location.href);
	}
}

function createActualPlaygroundCards() {
	let htmlStr = `<div class="card left">
    <span class="symbol"></span>
    <span class="value"></span>
    <span class="owner"></span>
</div>
<div class="card top">
    <span class="symbol"></span>
    <span class="value"></span>
    <span class="owner"></span>
</div>
<div class="card card-right">
    <span class="symbol"></span>
    <span class="value"></span>
    <span class="owner"></span>
</div>`;

	let playground = document.getElementById("actual-playground");
	playground.innerHTML = htmlStr;
}

function movePlaygroundUpAndDown() {
	let playground = document.getElementById("actual-playground");
	playground.classList.add("animForRightPlayground");
}

function clearAndResetPlayground() {
	let playground = document.getElementById("actual-playground");
	playground.innerHTML = "";
	if (playground.innerText == "") {
		playground.classList.remove("animForRightPlayground");
	}
}

function addAnimToPlayGroundCards() {
	createActualPlaygroundCards();
	let HtmlCards = document
		.getElementById("actual-playground")
		.getElementsByClassName("card");
	for (let i = 0; i < HtmlCards.length; i++) {
		HtmlCards[i].addEventListener("click", (e) => {
			if (i == 0) {
				playgroundCards[0].classList.add("animForLeftCard");
			} else if (i == 1) {
				playgroundCards[1].classList.add("animForTopCard");
			} else if (i == 2) {
				playgroundCards[2].classList.add("animForRightCard");
			}
		});
	}
	let btn = document.getElementById("abcde");
	// setTimeout(() => {
	// 	addAnimationToActualPlaygroundCards();
	// }, 1000);
	// setTimeout(() => {
	// 	movePlaygroundUpAndDown();
	// }, 3000);
	btn.addEventListener("click", () => {
		clearAndResetPlayground();
	});
}

addAnimToPlayGroundCards();

function addLeftToCards() {
	let cardsContainer = document.getElementById("cards");
	let cards = cardsContainer.getElementsByClassName("card");

	let x = 0;
	let width = window.innerWidth;
	x = 80 * (cards.length - 1);
	x += 120;
	cardsContainer.style.left = `${(width - x) / 2}px`;

	for (let i = 0; i < cards.length; i++) {
		cards[i].style.left = `${i * 80}px`;
	}
}
