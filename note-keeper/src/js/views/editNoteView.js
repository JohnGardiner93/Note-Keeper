class editNoteView {
  _parentEl = document.querySelector(`.modal--background`);
  _noteEl = this._parentEl.querySelector(`.modal--note`);
  _noteTitleEL = this._parentEl.querySelector(`.modal--note-title`);
  _noteTextEL = this._parentEl.querySelector(`.modal--note-text`);

  renderNote(title = `Note Title`, content = `Note Content`, color = `yellow`) {
    // Display note based on provided parameters
    this._noteTitleEL.textContent = title;
    this._noteTextEL.textContent = content;
    this._noteEl.style.backgroundColor = `var(--note-color--${color}-solid)`;

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
