import { Kono } from '../utils/kono';
import { PLAYER_1,
         PLAYER_2,
         EMPTY_CELL,
         KONO_BOARD,
         ALL_BUTTONS,
         NUMBER_OF_ROWS_COLS,
         PLAYER_1_ROW_FULL,
         PLAYER_2_ROW_FULL,
         PLAYER_1_ROW_FRAG,
         PLAYER_2_ROW_FRAG,
         PLAYER_LEFT_CELL,
         PLAYER_RIGHT_CELL,
         DISPLAY,
         displayValues } from '../constants';

let konoBrain = new Kono();

function setAttributes(el, options) {
	Object.keys(options).forEach(function(attr) {
		el.setAttribute(attr, options[attr]);
	})
};

function playerOneBtns(i, j) {
    return i === PLAYER_1_ROW_FULL || (i === PLAYER_1_ROW_FRAG && (j === PLAYER_LEFT_CELL || j === PLAYER_RIGHT_CELL));
}

function playerTwoBtns(i, j) {
	return i === PLAYER_2_ROW_FULL || (i === PLAYER_2_ROW_FRAG && (j === PLAYER_LEFT_CELL || j === PLAYER_RIGHT_CELL));
}
// generate game board with initial game buttons
for (let i = 0; i < NUMBER_OF_ROWS_COLS; i++) {
	for (let j = 0; j < NUMBER_OF_ROWS_COLS; j++) {
		let button = document.createElement("button");

		if (playerOneBtns(i, j)) {
		    setAttributes(button, {
                "class": `grid-btn-item ${PLAYER_1}`,
                "type": "button",
                "data-x": i,
                "data-y": j,
                "data-value": ""
            });
		} else if (playerTwoBtns(i, j)) {
            setAttributes(button, {
                "class":`grid-btn-item ${PLAYER_2}`,
                "type": "button",
                "data-x": i,
                "data-y": j,
                "data-value": ""
            });
		} else {
			setAttributes(button, {
                "class": `grid-btn-item ${EMPTY_CELL}`,
                "type": "button",
                "data-x": i,
                "data-y": j,
                "data-value": ""
            });
		}
		document.getElementById(`${KONO_BOARD}`).appendChild(button);
	};
};

for (let i = 0; i < 25; i++) {
    let button = document.getElementById(`${KONO_BOARD}`);
    setAttributes(button, {"data-value": i});
    //document.getElementsByClassName("grid-btn-item").setAttribute("data-value", i);
}
// TODO: can this be replaced with kono_board?
let buttons = document.querySelector('#buttons');
let gameButtons = document.querySelector(`#${KONO_BOARD}`);
let allButtons = buttons.querySelectorAll(`.${ALL_BUTTONS}`);
let emptyCells = buttons.querySelectorAll(`.${EMPTY_CELL}`);
let display = buttons.querySelector(`.${DISPLAY}`);
let isPlayerOne = true;
let clickSum = 0;

// listen clicks
for (const btn of allButtons) {
    console.log("clicked");
    btn.onclick = getPressedButtonData;
}

display.innerHTML = displayPlayersOrder(clickSum, isPlayerOne);

let startingPlayer = getCurrentPlayer();
console.log("startingPlayer", startingPlayer);
getCurrentPlayerButtons(startingPlayer);

function countClicks() {
  // count clicks only when available click or currentPlayer
// `"button.${getCurrentPlayer()}.js-disabled"`
//   if (!buttons.querySelectorAll(".js-disabled")) {
//       console.log("getCurrentPlayer.getAttribute('class')", getCurrentPlayer.getAttribute('js-disabled'));
//     }
  clickSum += 1;
  console.log("Clicks: ", clickSum);
  clickSum % 2 === 0 ? toggleCurrentPlayer() : null;
  display.innerHTML = displayPlayersOrder(clickSum, isPlayerOne);
}

function displayPlayersOrder(clickSum, isPlayerOne) {
    let displayMsg = displayValues.PLAYER_1_STARTS;

    if (clickSum !== 0 && isPlayerOne) {
        displayMsg = displayValues.PLAYER_1_PLAYS;
    } else if (!isPlayerOne) {
        displayMsg = displayValues.PLAYER_2_PLAYS;
    } else {}

    return displayMsg;
}

function getEmptyCells() {
    return emptyCells;
}

function getCurrentPlayerButtons(currentPlayer) {
    let currentPlayerClass = `.${currentPlayer}`;

    return buttons.querySelectorAll(currentPlayerClass);
}

function getPressedButtonData(event) {
    let x = +(this.dataset.x);
    let y = +(this.dataset.y);
    let index = y + x * NUMBER_OF_ROWS_COLS;
    let selectedButton = allButtons[index];
    gameButtons.onclick = countClicks;

    getAvailableMoves(x, y);
    moveButton(selectedButton);
  }

function getAvailableMoves(x, y) {
    let emptyCells = getEmptyCells();

    emptyCells.forEach(cell => {
        Math.abs(+cell.dataset.x - x) === 1 && Math.abs(+cell.dataset.y - y) === 1
        ? addClass(cell, "js-available")
        : addClass(cell, "js-disabled");
    });
    // find if there are cells where x is x+-1 and y is y+-1
    /*const conditions = [];
    let availableMoves = [];

    return availableMoves;*/
}

function clearAvailableMoves() {
    let emptyCells = getEmptyCells();
    emptyCells.forEach(cell => {
        removeClass(cell, "js-available")
        removeClass(cell, "js-disabled");
    });
}

function getCurrentPlayerButtonsCoordinates(currentPlayer) {
    let currentPlayerBtns = getCurrentPlayerButtons(currentPlayer);
    let currentPlayerBtnXY = [];
    currentPlayerBtns.forEach(btn => {
        let valueX = btn.getAttribute('data-x');
        let valueY = btn.getAttribute('data-y');
        currentPlayerBtnXY.push(valueX+valueY);
    });

    return currentPlayerBtnXY;
}

function getSelectedButtonCoordinates(selectedButton) {
    let selectedBtnX = selectedButton.getAttribute('data-x');
    let selectedBtnY = selectedButton.getAttribute('data-y');

    return selectedBtnX+selectedBtnY;
}

function getEmptyButtonsCoordinates() {
    let emptyCells = getEmptyCells();
    let emptyBtnXY = [];
    emptyCells.forEach(cell => {
        let valueX = cell.getAttribute('data-x');
        let valueY = cell.getAttribute('data-y');
        emptyBtnXY.push(valueX+valueY);
    });

    return emptyBtnXY;
}

function moveButton(selectedButton) {
    let currentPlayer = getCurrentPlayer();
    let currentPlayerBtns = getCurrentPlayerButtonsCoordinates(currentPlayer);
    let selectedBtn = getSelectedButtonCoordinates(selectedButton);
    let emptyCell = getEmptyButtonsCoordinates();
    // if selected button is current players button then remove the class
    if (isSelectedBtnCurrentPlayerBtn(selectedBtn, currentPlayerBtns)) {
        removeClass(selectedButton, currentPlayer);
        addClass(selectedButton, EMPTY_CELL);
    } else if (isSelectedBtnEmptyCell(selectedBtn, emptyCell)) {
        removeClass(selectedButton, EMPTY_CELL);
        addClass(selectedButton, currentPlayer);
    } else {}
}

function isSelectedBtnCurrentPlayerBtn(selected, current) {
    return current.indexOf(selected) > -1 ? true : false;
}

function isSelectedBtnEmptyCell(selected, empty) {
    return empty.indexOf(selected) > -1 ? true : false;
}

function getCurrentPlayer() {
    return isPlayerOne ? PLAYER_1 : PLAYER_2;
}

function toggleCurrentPlayer() {
    isPlayerOne = !isPlayerOne;
    displayPlayersOrder(clickSum, isPlayerOne);
    clearAvailableMoves();
}

function removeClass(selectedButton, removedClass) {
    selectedButton.classList.remove(removedClass);
}

function addClass(selectedButton, addedClass) {
    selectedButton.classList.add(addedClass);
}

function isContaining(selectedButton, containsClass) {
    selectedButton.classList.contains(containsClass);
}