"use strict";
/**
 * Creates new notesView that displays notes created by the user.
 * @module notesView
 */

import { computeCursorYPosition, pixelsToNumber } from "../helpers.js";

/**
 * Creates an object representation of the notesView on the page. Contains the notes created by the user.
 */
class NotesView {
  /**
   * Create the notesView object by finding the notes container in the DOM.
   */
  constructor() {
    this._parentEl = document.querySelector(`.container--notes`);
  }

  /**
   * Renders a new note based on the information provided. The new note is placed at the end of the notes container.
   * @param {Number} id - The id of the note being rendered.
   * @param {String} title - The title of the note being rendered.
   * @param {String} text - The text body of the note being rendered.
   * @param {String} color - The color of the note being rendered. Must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js} in order to properly render.
   * @returns {Element} The note that was generated from the provided data and inserted into the DOM.
   * @todo Combine with updateNoteContents
   * @see updateNoteContents
   * @static
   */
  renderNote(id, title, text, color) {
    const markup = this._generateNoteMarkup(id, title, text, color);
    this._parentEl.insertAdjacentHTML(`beforeend`, markup);
    const note = this._parentEl.lastElementChild;
    this._adjustNoteForTextOverflow(note);
    return note;
  }

  /**
   * Updates a pre-existing note based on the information provided.
   * @param {Number} id - The id of the note to be updated.
   * @param {String} title - The title of the note to be updated.
   * @param {String} text - The text body of the note to be updated.
   * @param {String} color - The color of the note to be updated. Must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js} in order to properly render.
   * @returns {Element} The note that was generated from the provided data and inserted into the DOM.
   * @todo Add handling if note is not found.
   * @static
   */
  updateNoteContents(id, title, text, color) {
    const note = this._findNote(id);
    const noteTitleEl = note.querySelector(`.note--title`);
    const noteTextEl = note.querySelector(`.note--text-body`);

    noteTitleEl.textContent = title;
    noteTextEl.textContent = text;
    note.dataset.color = color;

    this._adjustNoteForTextOverflow(note);

    return note;
  }

  /**
   * Removes the provided note from the DOM.
   * @param {Element} note - The note to remove.
   * @static
   */
  removeNote(note) {
    note.remove();
  }

  /**
   * Remove note from the notesView that has the id provided. Uses {@link removeNote}, but allows the note to be identified by id alone.
   * @param {Number} id - The id of the note to be removed.
   * @static
   */
  removeNoteByID(id) {
    const note = this._findNote(id);
    this.removeNote(note);
  }

  /**
   * Adds event handler to the delete button on an individual note. The provided handler function is bound with the parent element that hosts the targeted delete button so that the parent of the delete button can be manipulated by the handler.
   * @param {Function} handler - The handler function that will be called when the notes delete button is pressed.
   * @param {Element} note - The parent note of the delete note button.
   * @static
   */
  addHandlerDeleteNoteButton(handler, note) {
    note
      .querySelector(`.btn--delete-note`)
      .addEventListener("click", handler.bind(note));
  }

  /**
   * Adds event handler to the note such that when a note is clicked, the provided handler executes. This event handler filters out clicks that are not targeted on the note, note title, or note text body elements. If the target is none of the aforementioned items (e.g. the click target is the color picker, delete button, etc.), the provided handler does not fire. The handler is called with the provided note to allow the note to be manipulated by the handler.
   * @param {Function} handler - Function provided to be called if the note, note title, or note text body are clicked
   * @param {Element} note - The note to which the event will be attached. Passed to the handler function for context.
   * @static
   */
  addHandlerClickNote(handler, note) {
    note.addEventListener(
      `click`,
      function (e) {
        if (
          !(
            [...e.target.classList].includes(`note`) ||
            [...e.target.classList].includes(`note--title`) ||
            [...e.target.classList].includes(`note--text-body`)
          )
        )
          return;
        handler.call(note);
      }.bind(note)
    );
  }

  /**
   * Adds handlers for the color picker on a note. Set up so that handler only fires if a color picker dot is selected. Otherwise, nothing happens (e.g. clicking on the color picker container does nothing).
   * @param {Function} handler - The handler to be executed when a color picker dot is clicked.
   * @param {Element} note - The note that hosts the color picker being handled. Passed to the handler function for context.
   * @static
   */
  addHandlersColorPickerNote(handler, note) {
    note.querySelector(`.color-picker`).addEventListener(
      `click`,
      function (e) {
        if (![...e.target.classList].includes(`color-picker--dot`)) return;
        this._changeNoteColor(e.target.dataset.color, note);
        handler.call(note);
      }.bind(this)
    );
  }

  /**
   * Changes the color of the given note using the color provided. Must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js} in order to properly render.
   * @param {String} color
   * @param {Element} note
   */
  _changeNoteColor(color, note) {
    note.dataset.color = color;
  }

  /**
   * Returns the element of the note that has the requested id, if it exists.
   * @param {Number} id - The id of the note to be searched for.
   * @returns {Element | null} element that as the requested id, if it exists.
   */
  _findNote(id) {
    return [...this._parentEl.querySelectorAll(`.note`)].find(
      (note) => Number(note.dataset.id) === id
    );
  }

  /**
   * Generates the markup for a note using the information provided.
   * @param {Number} id - The id of the note markup to be made.
   * @param {String} title - The title of the note markup to be made.
   * @param {String} text - The text body of the note markup to be made.
   * @param {String} color - The color of the note markup to be made. Must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js} in order to properly render.
   * @returns {String} - Markup for note within provided parameters inserted.
   */
  _generateNoteMarkup(id, title, text, color) {
    return `
      <div class="note" data-id="${id}" data-color="${color}">
        <div class="btn--delete-note"></div>
        <div class="note--content">
          <p class="note--title">${title}</p>
          <p class="note--text-body">${text}</p>
        </div>
        <div class="note--footer">
          <div class="color-picker">
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="yellow"
            ></div>
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="blue"
            ></div>
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="green"
            ></div>
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="red"
            ></div>
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="purple"
            ></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generates the required markup to indicate that a note is longer than the notesView allows. Represented using a psuedo-element (outlined in CSS) that has an ellipsis text overlay. Over the last line of the note text body.
   * @param {String} color - The desired color of the fade element.
   * @returns {String} - String representation of the fade element markup.
   * @todo Refactor to eliminate use of color variable. It is unnecessary.
   */
  _generateOverflowMarkup() {
    return `<div class="fade">...</div>`;
  }

  /**
   * Method used to check whether the text in a text container element overflows past the defined boundaries of the text container. Handled manually in JavaScript due to desire to avoid exposing site to XSS attacks via innerHTML implementation. Handling of new line characters forces use of Javascript, as the ellipsis overflow state in CSS does not support mutliline text areas.
   * @param {Element} textContainerElement - Element to be analyzed. The text of the element will be compared with the boundaries of the element.
   * @returns {Boolean} - Indication of whether or not the text of the provided container overflows the boundary of the container.
   */
  _checkTextOverflows(textContainerElement) {
    const totalElementHeight = pixelsToNumber(
      window.getComputedStyle(textContainerElement).height
    );
    // Determine height of the provided text
    const textHeight = computeCursorYPosition(
      textContainerElement,
      textContainerElement.textContent.length
    );
    // If the provided text is longer that the viewable area of the container, the text is overflowing
    const textOverflows = textHeight > totalElementHeight;
    /*
    console.log(
      `text overflows? ${textHeight} > ${totalElementHeight} = ${
        textHeight > totalElementHeight
      }`
    );
    */
    return textOverflows;
  }

  /**
   * Determines whether or not the text body of a note overflows its container. If it does, a fade element is added to to indicate to the user that the note text is longer than what can be seen. If the text does not overflow, any fade element is removed and the full text body is visible.
   * @param {Element} note - The note to be analyzed and adjusted.
   */
  _adjustNoteForTextOverflow(note) {
    const textOverflows = this._checkTextOverflows(
      note.querySelector(`.note--text-body`)
    );

    const fadeElement = note.querySelector(`.fade`);
    if (textOverflows && !fadeElement) {
      note
        .querySelector(`.note--content`)
        .insertAdjacentHTML(`beforeend`, this._generateOverflowMarkup());
    }

    if (!textOverflows) {
      note.querySelector(`.fade`)?.remove();
    }
  }

  /**
   * Returns whether or not the NotesView container is empty e.g. does not have any notes.
   * @returns {Boolean} - True if the container does not have notes. False if the container does have notes.
   * @static
   */
  isEmpty() {
    return this._parentEl.children.length === 0;
  }
}

export default new NotesView();
