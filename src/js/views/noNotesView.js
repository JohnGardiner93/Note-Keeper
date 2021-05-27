class noNotesView {
  _parentEl = document.querySelector(`.no-notes-message`);

  addHandlerNewNoteButton(handler) {
    this._parentEl.querySelector(`.btn--no-notes-message`).addEventListener(
      `click`,
      function (e) {
        this.hide();
        handler();
      }.bind(this)
    );
  }

  render() {
    this._parentEl.style.display = `flex`;
  }

  hide() {
    this._parentEl.style.display = `none`;
  }
}

export default new noNotesView();
