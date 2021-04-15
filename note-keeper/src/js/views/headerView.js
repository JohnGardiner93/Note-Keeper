class HeaderView {
  _parentEl = document.querySelector(`.header`);

  addHandlerNewNoteButton(handler) {
    this._parentEl
      .querySelector(`.btn--new-note`)
      .addEventListener(`click`, handler.bind(this));
    console.log(this);
  }
}

export default new HeaderView();