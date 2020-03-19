export class Kono {
    constructor() {
      this._display = "";
    }

    handleKey(keyX, keyY) {
      let num = Number(keyX, keyY);
      if (!isNaN(num)) {
        this._buttonPressed(num);
      }
      return this._display;
    }

    // remove class from clicked area and add class to secondly clicked area

    _numberPressed(text) {
      if (this._display === "0") {
        this._display = text.toString();
      } else {
        this._display += text.toString();
      }

    }
    // get display() {
    //     return this._display
    // }
  }
