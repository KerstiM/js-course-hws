import { Kono } from '../utils/kono';
import { PLAYER_1, PLAYER_2, EMPTY_CELL, displayValues } from '../constants';

let konoBrain = new Kono();

let buttons = document.querySelector('#buttons');
let display = buttons.querySelector('.js-display');
let gameButtons = document.querySelector('#gameButtons');
let allButtons = buttons.querySelectorAll('.grid-item');
let emptyCells = buttons.querySelectorAll('.js-empty');

let isPlayerOne = true;
let clickSum = 0;

// listen clicks
for (const btn of allButtons) {
    btn.onclick = getPressedButtonData;
}

display.innerHTML = displayPlayersOrder(clickSum, isPlayerOne);

let startingPlayer = getCurrentPlayer();
console.log("startingPlayer", startingPlayer);
getCurrentPlayerButtons(startingPlayer);

function countClicks() {
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
    let value = +(this.dataset.value);
    let selectedButton = allButtons[value];
    gameButtons.onclick = countClicks;

    moveButton(selectedButton);
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
    // if selected button is current players button then let remove the class
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