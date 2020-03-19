import { Kono } from './utils/kono';
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
                'class': `grid-btn-item ${PLAYER_1}`,
                'type': "button",
                'data-x': i,
                'data-y': j,
                'data-value': j + i * 5
            });
		} else if (playerTwoBtns(i, j)) {
            setAttributes(button, {
                'class':`grid-btn-item ${PLAYER_2}`,
                'type': "button",
                'data-x': i,
                'data-y': j,
                'data-value': j + i * 5
            });
		} else {
			setAttributes(button, {
                'class': `grid-btn-item ${EMPTY_CELL}`,
                'type': "button",
                'data-x': i,
                'data-y': j,
                'data-value': j + i * 5
            });
		}
		document.getElementById(`${KONO_BOARD}`).appendChild(button);
	};
};

// TODO: can this be replaced with kono_board?
let buttons = document.querySelector('#buttons');
let gameButtons = document.querySelector(`#${KONO_BOARD}`);
let allButtons = buttons.querySelectorAll(`.${ALL_BUTTONS}`);
let display = buttons.querySelector(`.${DISPLAY}`);
let isPlayerOne = true;
let clickSum = 0;
let selectedCoordinates = [];

// listen clicks
for (const btn of allButtons) {
    console.log('clicked');
    // players first click can be only on player button not empty button
    // player second click can only be on empty button
    // if clicked on disabled button, then click won't count, waiting for a click on a available button
    btn.onclick = getPressedButtonData;
}

display.innerHTML = displayPlayersOrder(clickSum, isPlayerOne);

let startingPlayer = getCurrentPlayer();
console.log('startingPlayer', startingPlayer);
getCurrentPlayerButtons(startingPlayer);

function countClicks() {
    // TODO: count clicks only when available click or currentPlayer
    clickSum += 1;
    console.log('Clicks: ', clickSum);
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
    return buttons.querySelectorAll(`.${EMPTY_CELL}`);
}

function getAllButtons() {
    return buttons.querySelectorAll(`.${ALL_BUTTONS}`);
}

function getCurrentPlayerButtons(currentPlayer) {
    let currentPlayerClass = `.${currentPlayer}`;

    return buttons.querySelectorAll(currentPlayerClass);
}

function getPressedButtonData(event) {
    let x = +(this.dataset.x);
    let y = +(this.dataset.y);
    selectedCoordinates = [x, y];
    let index = y + x * NUMBER_OF_ROWS_COLS;
    let selectedButton = allButtons[index];
    gameButtons.onclick = countClicks;
    getAvailableMoves(x, y);
    moveButton(selectedButton);
  }

function getAvailableMoves(x, y) {
    let emptyCells = getEmptyCells();
    let availableMoves = [];

    emptyCells.forEach(cell => {
        if (Math.abs(+cell.dataset.x - x) === 1 && Math.abs(+cell.dataset.y - y) === 1) {
            addClass(cell, 'js-available')
            availableMoves.push({ y: +cell.dataset.y, x: +cell.dataset.x});
        } else {
            addClass(cell, 'js-disabled');
        }
    });

    return availableMoves;
}

function clearAvailableMoves() {
    let allButtons = getAllButtons();

    allButtons.forEach(cell => {
        removeClass(cell, 'js-available')
        removeClass(cell, 'js-disabled');
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

let togglePlayer = document.getElementById("togglePlayer");
togglePlayer.addEventListener('click', function() { toggleCurrentPlayer(); }, false);

function toggleCurrentPlayer() {
    console.log("toggel");
    isPlayerOne = !isPlayerOne;
    console.log(isPlayerOne);
    displayPlayersOrder(clickSum, isPlayerOne);
    console.log( displayPlayersOrder(clickSum, isPlayerOne));
    clearAvailableMoves();
}

function removeClass(selectedButton, removedClass) {
    selectedButton.classList.remove(removedClass);
}

function addClass(selectedButton, addedClass) {
    selectedButton.classList.add(addedClass);
}

function isGameOver() {
    // Let's assume that yellow started from top and purple from bottom
    // find if player 1 buttons are on the bottom
    // find if player 2 buttons are on the top
    // display the winner on display
}

function isClickOnAvailableBtn() {
    /*
    // compare if the clicked button is one of the avialble buttons
    let currentPlayer = getCurrentPlayer(); // player string
    getCurrentPlayerButtons(currentPlayer);
    availableMoves = getAvailableMoves(selectedCoordinates[0], selectedCoordinates[1]);
    console.log('prev', prevAvailableMoves);
    // selectedCoordinates [0, 2] x:y
    // availableMoves {y:1, x:1} {y:3, x:1}
    let res = [];
    availableMoves.forEach(r => {
        res.push(Object.values(r));
        //console.log('Object.values(r)', Object.values(r));
    });
    let prevRes = [];
    prevAvailableMoves.forEach(r => {
        prevRes.push(Object.values(r));
    });
    console.log('prevRes', prevRes);
    console.log('res', res);
    console.log('prevSelectedBtnXY', prevSelectedBtnXY);

    // check if the new selected button is one of the previus availablebuttons
    let result = res.forEach(r => {
        r.includes(prevSelectedBtnXY[0]) && r.includes(prevSelectedBtnXY[1])
        console.log("INCLUDES ", r.includes(prevSelectedBtnXY[0]) && r.includes(prevSelectedBtnXY[1]));
    })
    prevAvailableMoves = availableMoves;
    prevSelectedBtnXY.pop();
    prevSelectedBtnXY.pop();
    prevSelectedBtnXY.push(selectedCoordinates[0], selectedCoordinates[1]);
    //console.log('res', res.toString());
    return result;*/
}
/*
let prevSelectedBtnXY = [];
let availableMoves = [];
let prevAvailableMoves = [];
*/