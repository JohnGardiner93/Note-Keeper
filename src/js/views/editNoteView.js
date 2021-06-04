"use strict";
/**
 * Creates new editNotesView which displays a note editing window with title, text body, color picker, close button, and delete button. User can also interact with the page using the "Esc" key and via clicking outside of the note.
 * @module ./views/editNotesView.js
 */

import { DEFAULT_NOTE_TEXT } from "../config.js";
import { NOTE_COLORS } from "../config.js";
import {
  computeLineHeight,
  computeCursorYPosition,
  pixelsToNumber,
} from "../helpers.js";

/**
 * Creates an object representation of the note editing window on the page. It is a modal window.
 */
class editNoteView {
  /**
   * Create the editNoteView object by find the element with the "modal background" class. Also finds the various elements of with the editNoteView. Sets the "_noteTouched" property to false, by default, which is used to track whether or not the user has interacted with the note editor in any significant way.
   */
  constructor() {
    this._parentEl = document.querySelector(`.modal--background`);
    this._noteEl = this._parentEl.querySelector(`.modal--note`);
    this._noteTitleEl = this._parentEl.querySelector(`.modal--note-title`);
    this._noteTextEl = this._parentEl.querySelector(`.modal--note-text`);
    this._colorPickerEl = this._parentEl.querySelector(`.color-picker`);
    this._noteTouched = false;
  }

  /**
   * Renders the note that will be edited in the editNotesView. If the note is not new, the note is automatically touched so that, in the event that the user does not interact with a pre-existing note, the note will still save properly to storage and not be deleted by other logic that purges untouched notes.
   * @param {String} title - The title of the note as provided. Defaults to empty.
   * @param {String} content - The note text of the note as provided. Defaults to empty.
   * @param {String} color - The color of the note provided. Defaults to NOTE_COLORS[0] from {@link ../config.js} e.g. yellow.
   * @param {Boolean} isNewNote - Indication of whether or not the note is newly created. Enables handling of empty or untouched notes.
   */
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

    // If this is not a new note, we want to make sure the note is still saved even if it's not interacted with at all.
    if (!isNewNote) {
      this._touchNote();
    }

    this.renderNoteEditor();
  }

  /**
   * Renders the note editor by changing the display attribute of the editNotesView parent container to block, thus placing it in the document flow. The method than forces the window to focus on the note text being displayed so that the user can start typing notes immediately.
   */
  renderNoteEditor() {
    this._parentEl.style.display = `block`;
    this._noteTextEl.focus();
  }

  /**
   * Closes the note editor by changing the display attribute of the editNotesView parent container to "none", removing the element from sight and from the document flow. The textContent of the title and text body of the note editing area are set to defaults from {@link ../config.js}. The note color is also set to a default using the _changeNoteColor method. The default note being "displayed" at this point is untouched as a default.
   */
  closeNoteEditor() {
    this._parentEl.style.display = `none`;
    this._noteTitleEl.textContent = DEFAULT_NOTE_TEXT[0];
    this._noteTextEl.textContent = DEFAULT_NOTE_TEXT[1];
    this._changeNoteColor(NOTE_COLORS[0]);
    this._unTouchNote();
  }

  /**
   * Adds event handler for focus out event. Fires when a user has been focused (cursor within) on the note title or note text body and changes that focus to something else or nothing. Uses the provided handler once the event handler has verified that the event was indeed fired on the note title of note text and after verifying that the editNoteView is actually visible. If the note being interacted with is blank, the note is untouched, since the user did not make any significant changes to the note.
   * @param {Function} handler - The handler to be fired when the note title or note text loses focus.
   */
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

  /**
   * Adds handler for focus in event on note title and note text. Fires when a user interacts direct whith one of these two elements. When this event fires, the note is marked as "touched" to indicate that the user may have made a significant change to the note.
   */
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

  /**
   * Adds handler for keydown event on window, specifically for when the Escape key is pressed. The event handler checks that the editNoteView is actually visible and checks that the escape key was specifically pressed. The focus is blurred from the note, which triggers the focus out event. If the note is blank, the note is marked as untouched. The provided handler is then executed.
   * @param {Function} handler -
   */
  addHandlerEscapeKey(handler) {
    // Note is checked when the user hits escape to exit the note. If title and text are blank, the note is made to be untouched. Must be done on escape key event because full escape key event fires before focusout event. Prevents blank notes from making it to the NotesView.
    window.addEventListener(
      `keydown`,
      function (e) {
        if (!this._displayIsActive()) return;
        if (e.key === "Escape") {
          e.target.blur(); // Forces the Focus-Out event to happen before the rest of the escape event. Otherwise, focus-out event will occur after the escape event has executed, meaning the focus-out events will happen on an empty note.
          if (this._noteIsBlank()) this._unTouchNote();
          handler();
        }
      }.bind(this)
    );
  }

  /**
   * Adds handler for keydown event, specifically the enter key. Validates that:
   * - The editNoteView is active
   * - Key pressed is actually "Enter"
   * - Selection API is supported
   * - Cursor is placed somewhere.
   * Prevents default behavior of the browser "Enter" key so that custom behavior can be added. When "Enter" is pressed, the position of the cursor is compared to the length of the viewable text element. If the cursor is on the last line of the viewable text element, the text element is scrolled down one line and a new line character is added to the text. The cursor is then placed after the new line character. If the cursor is not on the last line of the text element, all the same events happen, but the viewable area of the text is not scrolled.
   */
  addHandlersEnterKey() {
    this._parentEl.addEventListener(
      `keydown`,
      function (e) {
        ////////////////////////////////////////////
        // Validation //
        if (!this._displayIsActive()) return;
        if (e.key !== `Enter`) return;

        e.preventDefault(); // Browser's default behavior is generally to add some sort of element. This approach insteads modifies the single text node inside the element

        // Return if Selection API is not supported on the users browser
        const isSupported = typeof window.getSelection !== "undefined";
        if (!isSupported) return;

        // Grab the current selection, if any
        const selection = window.getSelection();

        // Return if there is no selection (e.g. no cursor set)
        if (selection.rangeCount === 0) return;

        ////////////////////////////////////////////
        // Add New Line Character at Cursor (Caret) Location //
        const el = e.target;
        const range = selection.getRangeAt(0); // Get the range that is within the selection. There will only ever be one range in the case of this application since this event fires only for the note title or text when editing a note.

        // Capture the caret position at the time of the 'Enter' key event. If the user has highlighted text when the enter key event is fired, this sets the caret position to the first part of the range, regardless of which way the user selected the content to be overwritten (left-to-right or right-to-left). If the user has only placed a cursor, the start and end of the range are the same and thus the caret position is set to the location of both items (as they are identical)
        const caretPos =
          range.startOffset < range.endOffset
            ? range.startOffset
            : range.endOffset;

        // Calculates the length of the range selected. Equals 0 if the cursor is simply set.
        const rangeLength = Math.abs(range.startOffset - range.endOffset);

        // Get the original number of characters in the text node we are targeting
        const originalLength = el.textContent.length;

        // If the caret is at the last possible position in the text, use two new line characters in order to advance to the next line. Only one is needed if you are in the middle of a paragraph
        const newLine = caretPos === originalLength ? `\n ` : `\n`;

        // Insert the newLine character into the range. If a range of text was selected, it will be omitted from the new text
        el.textContent =
          el.textContent.slice(0, caretPos) +
          `${newLine}` +
          el.textContent.slice(caretPos + rangeLength, originalLength);

        ////////////////////////////////////////////
        // Move Cursor to End of New Line Character //
        const newCaretPosition = caretPos + 1;

        range.setStart(el.childNodes[0], newCaretPosition); // Reset the start of the range so that it starts at the desired caret position. There is only one child node in our specific case - the text node (e.g. text content) of our note text or note title
        range.collapse(true); // Collapse the range to its start position, which starts at our newCaretPosition.

        ////////////////////////////////////////////
        // Handle Scrolling //
        // If the user is editing the text in the middle of the scroll view, don't scroll down. If the user is on the last line of the scroll view, scroll down one line

        // --- Required parameters ---
        // Gets the height of the text editing area that scrolls.
        const targetElementScrollAreaHeight = pixelsToNumber(
          window.getComputedStyle(el).height
        );
        // Gets the position of the caret relative to the size of text body being edited
        const scrollPosition = computeCursorYPosition(el, newCaretPosition);
        // Gets the height of the lines in the text body being edited
        const elementLineHeight = computeLineHeight(el);

        // Number of full text lines in the scroll area. Changes depending on window size. The number is rounded down so that partial lines are not accounted for in height calculations.
        const numFullLinesInScrollArea = Math.floor(
          targetElementScrollAreaHeight / elementLineHeight
        );

        //
        /**
         * This equation determines the position of the caret relative to the location of the caret within the scrollable area. The amount of scroll is accounted for, which must be done, otherwise the caret placed at any point of the text longer than the scroll area would alwas be considered past the bottom border of the scroll area. The caret position is compared to the height of the scroll area (in increments of line height). Partial lines are ignored. If the caret position is equal to or greater than the height of the scroll area, the text will be scrolled.
         * Variables:
         * - scrollPosition - The height of an element with all of the text from the start of the target element's text up to the cursor
         * - el.scrollTop - The scroll level of the scrollable area. As the scrollbar for a scrollable element is moved, the scrollTop position adjusts with it. It indicates the pixels between the actual start of the text (0) and the start of the viewable text area (top border of the element, thus, "scrollTop")
         * - numFullLinesInScrollArea - The number of full text lines that are visible in the text area. Maxes out at a certain number depending on the users window
         * - elementLineHeight - The height of one line of text.
         */
        const cursorAtLastLine =
          scrollPosition - el.scrollTop >=
          numFullLinesInScrollArea * elementLineHeight;

        // console.log(
        //   `${scrollPosition} - ${el.scrollTop} >= ${numFullLinesInScrollArea} * ${elementLineHeight}`
        // );

        // If the enter event has cause the caret to fall outside the scrolling window, the window scrolls down one line.
        if (cursorAtLastLine) el.scrollTop += elementLineHeight;
      }.bind(this)
    );
  }

  /**
   * Adds handlers for color picker by monitoring the click event on the color picker element. Only performs actions when the target is a color picker dot. When the target is a dot, the note color is changed according to which dot was selected. The handler is then executed.
   * @param {Function} handler - The handler to be executed when the click event conditions are met.
   */
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

  /**
   * Adds handler for delete button. Listens for click event on delete note button. Executes handler when clicked.
   * @param {Function} handler - Function to be executed upon clicking the delete button.
   */
  addHandlerDeleteButton(handler) {
    this._noteEl
      .querySelector(`.btn--modal--delete-note`)
      .addEventListener(`click`, handler);
  }

  /**
   * Adds handler for closing the note. There are two ways to close a note - clicking the "x" button, or clicking outside of the note. If either event is detected, the handler is executed. Does not immediately close note, as the controller must obtain information from the note before closing and clearing it.
   * @param {Function} handler - Function to be executed when the note is being closed.
   * @todo Determine if it makes more sense to close the note via this handler instead of in the controller.
   */
  addHandlersCloseNote(handler) {
    // Click the close button
    this._noteEl
      .querySelector(`.btn--modal--close`)
      .addEventListener(`click`, handler);
    // Click on anything other than the note e.g. outside the note.
    this._parentEl.addEventListener(
      `click`,
      function (e) {
        if (e.target !== this._parentEl) return;
        handler();
      }.bind(this)
    );
  }

  /**
   * Returns the state of the note being edited in Array format - [title, text, color]
   * @returns {Array} - Returns the state of the note being edited.
   */
  getNoteState() {
    return [
      this._noteTitleEl.textContent.trimEnd(),
      this._noteTextEl.textContent.trimEnd(),
      this._noteEl.dataset.color,
    ];
  }

  /**
   * Changes the color of the note being edited (on the editNoteView)
   * @param {String} color - The color of the note being rendered. Must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js} in order to properly render.
   * @todo Consider altering the background color handling such that dataset.color actually drives the color, not a manual style set.
   */
  _changeNoteColor(color) {
    this._noteEl.dataset.color = color;
    this._noteEl.style.backgroundColor = `var(--note-color--${color})`;
  }

  /**
   * Marks the _noteTouched property as true to indicate that the user may have made a significant change to the note. Used to handle saving, note deletion, etc.
   */
  _touchNote() {
    this._noteTouched = true;
  }

  /**
   * Marks the _noteTouched property as false to indicate that the user has not made any significant changes to the note. Used to handle saving, note deletion, etc.
   */
  _unTouchNote() {
    this._noteTouched = false;
  }

  /**
   * Returns a boolean indicating whether or not a note is blank. Space characters do not count as content and are trimmed out.
   * @returns {Boolean} - True - note is blank. False - Not is not blank.
   */
  _noteIsBlank() {
    return (
      this._noteTitleEl.textContent.trim() === "" &&
      this._noteTextEl.textContent.trim() === ""
    );
  }

  /**
   * Returns a boolean indicating wheter or not the editNoteView is actively being displayed.
   * @returns {Boolean} True - editNoteView is visible. False - editNoteView is not visible.
   */
  _displayIsActive() {
    return this._parentEl.style.display !== `none`;
  }

  /**
   * Get _noteTouched property, which indicates whether or not the note being edited is considered "touched".
   */
  get noteTouched() {
    return this._noteTouched;
  }
}

export default new editNoteView();
