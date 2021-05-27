class HeaderView {
  _parentEl = document.querySelector(`.header`);
  _buttonEl = this._parentEl.querySelector(`.btn--new-note`);

  addHandlerNewNoteButton(handler) {
    this._buttonEl.addEventListener(`click`, handler.bind(this));
  }

  highlightNewNoteButton() {
    this._buttonEl.classList.add(`btn--highlight`);
  }

  unHighlightNewNoteButton() {
    this._buttonEl.classList.remove(`btn--highlight`);
  }
}

export default new HeaderView();
