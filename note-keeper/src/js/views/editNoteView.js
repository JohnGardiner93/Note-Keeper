class editNoteView {
  _parentEl = document.querySelector(`.modal--background`);

  renderNote(title = `Note Title`, content = `Note Content`, color = `yellow`) {
    // Display note based on provided parameters
    this._parentEl.querySelector(`.modal--note-title`).textContent = title;
    this._parentEl.querySelector(`.modal--note-text`).textContent = content;
    this._parentEl.querySelector(
      `.modal--note`
    ).style.backgroundColor = `--note--color-${color}`;

    this.renderNoteEditor();
  }

  renderNoteEditor() {
    this._parentEl.style.display = `block`;
  }

  closeNoteEditor() {
    this._parentEl.style.display = `none`;
  }
}

export default new editNoteView();

// const btnEditorClose = noteEditorWindowEl.querySelector(`.btn--modal--close`);
