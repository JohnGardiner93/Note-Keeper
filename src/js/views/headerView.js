"use strict";
/**
 * Creates new HeaderView which hosts logo icon, title of the page, and a button to add a new note.
 * @module headerView
 */

/**
 * Creates new HeaderView class which hosts logo icon, title of the page, and a button to add a new note.
 */
class HeaderView {
  /**
   * Create a HeaderView object
   */
  constructor() {
    this._parentEl = document.querySelector(`.header`);
    this._buttonEl = this._parentEl?.querySelector(`.btn--new-note`);
  }

  /**
   * Add event handler to the new note button.
   * @param {function} handler - The callback function to be executed when the new note button is pressed.
   * @static
   */
  addHandlerNewNoteButton(handler) {
    this._buttonEl.addEventListener(`click`, handler.bind(this));
  }

  /**
   * Highlight the new note button by adding a class to its classList
   * @static
   */
  highlightNewNoteButton() {
    this._buttonEl.classList.add(`btn--highlight`);
  }

  /**
   * Unhighlight the new note button by removing a class from its classList
   * @static
   */
  unHighlightNewNoteButton() {
    this._buttonEl.classList.remove(`btn--highlight`);
  }
}

export default new HeaderView();
