import { DEFAULT_NOTE_TEXT } from "../config.js";
import { NOTE_COLORS } from "../config.js";

class editNoteView {
  _parentEl = document.querySelector(`.modal--background`);
  _noteEl = this._parentEl.querySelector(`.modal--note`);
  _noteTitleEl = this._parentEl.querySelector(`.modal--note-title`);
  _noteTextEl = this._parentEl.querySelector(`.modal--note-text`);
  _colorPickerEl = this._parentEl.querySelector(`.color-picker`);
  _noteTouched = false;

  renderNote(
    title = "",
    content = "",
    color = NOTE_COLORS[0],
    isNewNote = true
  ) {
    // Display note based on provided parameters
    this._noteTitleEl.textContent = title;
    this._noteTextEl.textContent = content;
    this._changeNoteColor(color);

    // If this is not a new note, we want to make sure the note is still saved even if it's not touched at all.
    if (!isNewNote) {
      this._touchNote();
      // console.log("This note has been touched before");
    }

    this.renderNoteEditor();
  }

  renderNoteEditor() {
    this._parentEl.style.display = `block`;
  }

  closeNoteEditor() {
    this._parentEl.style.display = `none`;
    this._noteTitleEl.textContent = DEFAULT_NOTE_TEXT[0];
    this._noteTextEl.textContent = DEFAULT_NOTE_TEXT[1];
    this._changeNoteColor(NOTE_COLORS[0]);
    this._unTouchNote();
  }

  addHandlerTextElementsFocusOut(handler) {
    [this._noteTitleEl, this._noteTextEl].forEach((el) =>
      el.addEventListener(`focusout`, handler)
    );
  }

  addHandlerTextElementsFocusIn() {
    this._noteEl.addEventListener(
      `focusin`,
      function (e) {
        if (e.target !== this._noteTitleEl && e.target !== this._noteTextEl) {
          return;
        }
        this._touchNote();
      }.bind(this)
    );
  }

  addHandlersColorPicker(handler) {
    this._colorPickerEl.addEventListener(
      `click`,
      function (e) {
        if (![...e.target.classList].includes(`color-picker--dot`)) return;
        this._changeNoteColor(e.target.dataset.color);
        this._touchNote();
        handler();
      }.bind(this)
    );
  }

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
    this._noteEl.style.backgroundColor = `var(--note-color--${color})`;
  }

  addHandlerDeleteButton(handler) {
    this._noteEl
      .querySelector(`.btn--modal--delete-note`)
      .addEventListener(`click`, handler);
  }

  _touchNote() {
    this._noteTouched = true;
  }

  _unTouchNote() {
    this._noteTouched = false;
  }

  get noteTouched() {
    return this._noteTouched;
  }
}

export default new editNoteView();

// const btnEditorClose = noteEditorWindowEl.querySelector(`.btn--modal--close`);
