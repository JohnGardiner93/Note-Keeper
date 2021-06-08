"use strict";
/**
 * Creates new NoNotesView which displays a message and button if the user does not have any notes on the site.
 * @module noNotesView
 */

/**
 * Creates an object representation of the "no notes message" on the page. Contains an icon, message, and button
 */
class NoNotesView {
  /**
   * Create the NoNotesView object by finding the no notes message html block
   */
  constructor() {
    this._parentEl = document.querySelector(`.no-notes-message`);
  }

  /**
   * Add event handler to the new note button in the no notes message. When the button is pressed, the NoNotesView is hidden, then the provided handler function is executed.
   * @param {function} handler - The callback function to be executed when the new note button is pressed.
   * @static
   */
  addHandlerNewNoteButton(handler) {
    this._parentEl.querySelector(`.btn--no-notes-message`).addEventListener(
      `click`,
      function () {
        this.hide();
        handler();
      }.bind(this)
    );
  }

  /**
   * Renders the NoNotesView by changing the display attribute of the block to flex.
   * @static
   */
  render() {
    this._parentEl.style.display = `flex`;
  }

  /**
   * Hides the NoNotesView by changing the display attribute of the block to "none", removing it from the document flow.
   * @static
   */
  hide() {
    this._parentEl.style.display = `none`;
  }
}

export default new NoNotesView();
