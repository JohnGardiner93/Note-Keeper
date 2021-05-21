import { DEFAULT_NOTE_TEXT } from "../config.js";
import { NOTE_COLORS } from "../config.js";
import { pixelsToNumber } from "../helpers.js";

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
    // Note is checked when the user stops focusing on the title or text. If title and text are blank, the note is made to be untouched. Prevents blank notes from making it to the NotesView
    this._noteEl.addEventListener(
      `focusout`,
      function (e) {
        if (e.target !== this._noteTitleEl && e.target !== this._noteTextEl) {
          return;
        }
        if (this._noteIsBlank()) this._unTouchNote();
        handler();
      }.bind(this)
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

  addHandlerEscapeKey(handler) {
    // Note is checked when the user hits escape to exit the note. If title and text are blank, the note is made to be untouched. Must be done on escape key event because full escape key event fires before focusout event. Prevents blank notes from making it to the NotesView.
    window.addEventListener(
      `keydown`,
      function (e) {
        if (!this._displayIsActive()) return;
        if (e.key === "Escape") {
          e.target.blur(); // Forces the Focus-Out event to happen before the rest of the escape event. Otherwise, focus-out event will occur after the escape event has executed, meaning the focus-out events will happen on an empty note.
          console.log(`escaped`);
          if (this._noteIsBlank()) this._unTouchNote();
          handler();
        }
      }.bind(this)
    );
  }

  addHandlersEnterKey() {
    this._parentEl.addEventListener(
      `keydown`,
      function (e) {
        if (!this._displayIsActive()) return;
        if (e.key === `Enter`) {
          ////////////////////////////////////////////
          // ADD NEW LINE CHARACTER AT CURSOR (CARET) LOCATION
          e.preventDefault(); // Browser's default behavior is generally to add some sort of element. This approach insteads modifies the single text node inside the element

          const isSupported = typeof window.getSelection !== "undefined";
          if (!isSupported) return; // Return if Selection API is not supported on the users browser

          const selection = window.getSelection();

          if (selection.rangeCount === 0) return; // Return if there is no cursor set
          const el = e.target;
          const range = selection.getRangeAt(0); // Get the range that is within the selection. There will only ever be one range in the case of this application since this event fires only for the note title or text when editing a note.

          // Capture the caret position at the time of the 'Enter' key event. If the user has highlighted text when the enter key event is fired, this sets the caret position to the first part of the range, regardless of which way the user selected the content to be overwritten (left-to-right or right-to-left). If the user has only placed a cursor, the start and end of the range are the same and thus the caret position is set to the location of both items
          const caretPos =
            range.startOffset < range.endOffset
              ? range.startOffset
              : range.endOffset;

          // Calculates the length of the range
          const rangeLength = Math.abs(range.startOffset - range.endOffset);

          const originalLength = el.textContent.length; // Get the original number of characters in the text node we are targeting

          const newLine = caretPos === originalLength ? `\n ` : `\n`; // If the caret is at the last possible position in the text, use two new line characters in order to advance to the next line. Only one is needed if you are in the middle of a paragraph

          el.textContent =
            el.textContent.slice(0, caretPos) +
            `${newLine}` +
            el.textContent.slice(caretPos + rangeLength, originalLength);

          const newCaretPosition = caretPos + 1;
          range.setStart(el.childNodes[0], newCaretPosition); // Reset the start of the range so that it starts at the desired caret position. There is only one child node in our specific case - the text node (e.g. text content) of our note text or note title
          range.collapse(true); // Collapse the range to the beginning. Sets the cursor to the beginning of the range

          ////////////////////////////////////////////
          // HANDLE SCROLLING
          // If the user is editing the text in the middle of the scroll view, don't scroll down. If the user is on the last line of the scroll view, scroll down one line

          // --- Required parameters ---
          // Gets the height of the text editing area that scrolls.
          const targetElementScrollAreaHeight = pixelsToNumber(
            window.getComputedStyle(el).height
          );
          // Gets the position of the caret relative to the size of text body being edited
          const scrollPosition = this._computeScrollPosition(
            el,
            newCaretPosition
          );
          // Gets the height of the lines in the text body being edited
          const elementLineHeight = this._computeLineHeight(el);

          // Determines if the position of the caret is at the last line of the scrollable window by comparing the position of the caret (relative to the first line of the text visible in the scroll window) with the total height of the scrollable window.

          const numFullLinesInScrollArea = Math.floor(
            targetElementScrollAreaHeight / elementLineHeight
          );

          const cursorAtLastLine =
            scrollPosition - el.scrollTop >=
            numFullLinesInScrollArea * elementLineHeight;

          // console.log(
          //   `${scrollPosition} - ${el.scrollTop} >= ${numFullLinesInScrollArea} * ${elementLineHeight}`
          // );

          // If the enter event has cause the caret to fall outside the scrolling window, the window scrolls down one line.
          if (cursorAtLastLine) el.scrollTop += elementLineHeight;
        }
      }.bind(this)
    );
  }

  addHandlersColorPicker(handler) {
    this._colorPickerEl.addEventListener(
      `click`,
      function (e) {
        if (![...e.target.classList].includes(`color-picker--dot`)) return;
        this._changeNoteColor(e.target.dataset.color);
        handler();
      }.bind(this)
    );
  }

  getNoteState() {
    return [
      this._noteTitleEl.textContent.trimEnd(),
      this._noteTextEl.textContent.trimEnd(),
      this._noteEl.dataset.color,
    ];
  }

  addHandlersCloseNote(handler) {
    this._noteEl
      .querySelector(`.btn--modal--close`)
      .addEventListener(`click`, handler);
    this._parentEl.addEventListener(
      `click`,
      function (e) {
        if (e.target !== this._parentEl) return;
        handler();
      }.bind(this)
    );
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

  _noteIsBlank() {
    return this._noteTitleEl.textContent.trim() === "" &&
      this._noteTextEl.textContent.trim() === ""
      ? true
      : false;
  }

  _displayIsActive() {
    return this._parentEl.style.display !== `none`;
  }

  get noteTouched() {
    return this._noteTouched;
  }

  // Determines the line height (leading) of the requested element by creating en empty element, duplicating the font-family and fontsize of the provided element, then adding a single new line to the created element. The resulting height of the newly created element is the line height of the element provided.
  _computeLineHeight(el) {
    const temp = document.createElement(el.nodeName);

    // Copy the relevant stylings from the provided element into the temporary element
    const elStyle = window.getComputedStyle(el);
    temp.style.fontFamily = elStyle.fontFamily;
    temp.style.fontSize = elStyle.fontSize;
    temp.style.fontWeight = elStyle.fontWeight;
    temp.style.position = "absolute";
    temp.style.whiteSpace = elStyle.whiteSpace;

    // Add text (and thus a line) to the temporary element
    temp.textContent = "A";

    // Add the temporary element to the parentNode of the provided element
    el.parentNode.appendChild(temp);
    const lineHeight = temp.clientHeight;

    // Clean up - remove the temporary element from the document
    temp.parentNode.removeChild(temp);

    return lineHeight;
  }

  // Determines the scroll position of the cursor based on the cursor's position in the text body of the element provided. Works by removing all text after the caret position from a rough copy of the provided element. The resulting height of the truncated copy is the scroll position/location of the caret.
  _computeScrollPosition(el, caretPosition) {
    const temp = document.createElement(el.nodeName);

    // Set the styling of the temperorary element. The styling must be absolute so that the temperorary element is not affected by the growth or size of the original element. The temporary element is otherwise susceptible to its siblings, as the original and temp element will share a parent.
    const elStyle = window.getComputedStyle(el);
    temp.style.fontFamily = elStyle.fontFamily;
    temp.style.fontSize = elStyle.fontSize;
    temp.style.fontWeight = elStyle.fontWeight;
    temp.style.position = "absolute";
    temp.style.whiteSpace = elStyle.whiteSpace;

    // Set the text content of the temp element to be all the text up to the caret.
    temp.textContent = el.textContent.slice(0, caretPosition);

    // Add the temporary element to the parentNode of the provided element
    el.parentNode.appendChild(temp);
    const position = pixelsToNumber(window.getComputedStyle(temp).height);

    // Clean up - remove the temporary element from the document
    temp.parentNode.removeChild(temp);

    return position;
  }
}

export default new editNoteView();

// const btnEditorClose = noteEditorWindowEl.querySelector(`.btn--modal--close`);
