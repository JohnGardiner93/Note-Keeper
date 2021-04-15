import { DEFAULT_NOTE_TEXT } from '../config.js';
import { NOTE_COLORS } from '../config.js';

class editNoteView {
  _parentEl = document.querySelector(`.modal--background`);
  _noteEl = this._parentEl.querySelector(`.modal--note`);
  _noteTitleEl = this._parentEl.querySelector(`.modal--note-title`);
  _noteTextEl = this._parentEl.querySelector(`.modal--note-text`);
  _noteTextEl = this._parentEl.querySelector(`.modal--note-text`);

  renderNote(
    title = DEFAULT_NOTE_TEXT[0],
    content = DEFAULT_NOTE_TEXT[1],
    color = NOTE_COLORS[0]
  ) {
    // Display note based on provided parameters
    this._noteTitleEl.textContent = title;
    this._noteTextEl.textContent = content;
    this._changeNoteColor(color);

    this.renderNoteEditor();
  }

  renderNoteEditor() {
    this._parentEl.style.display = `block`;
  }

  closeNoteEditor() {
    this._parentEl.style.display = `none`;
    this._noteTitleEl.textContent = DEFAULT_NOTE_TEXT[0];
    this._noteTextEl.textContent = DEFAULT_NOTE_TEXT[0];
    this._changeNoteColor(NOTE_COLORS[0]);
  }

  addHandlersFocusOut(handler) {
    [this._noteTitleEl, this._noteTextEl].forEach(el =>
      el.addEventListener(`focusout`, handler)
    );
  }

  addHandlersColorPicker(handler) {}

  getNoteState() {
    return [
      this._noteTitleEl.textContent,
      this._noteTextEl.textContent,
      this._noteEl.dataset.color,
    ];
  }

  addHandlerCloseButton(handler) {
    this._noteEl
      .querySelector(`.btn--modal--close`)
      .addEventListener(`click`, handler);
  }

  _changeNoteColor(color) {
    this._noteEl.dataset.color = color;
    this._noteEl.style.backgroundColor = `var(--note-color--${color}-solid)`;
  }
}

export default new editNoteView();

// const btnEditorClose = noteEditorWindowEl.querySelector(`.btn--modal--close`);
