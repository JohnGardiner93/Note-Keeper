"use strict";
/**
 * Controller for the app. Passes data back and forth between the data model and the views.
 */

import * as model from "./model.js";
import notesView from "./views/notesView.js";
import editNoteView from "./views/editNoteView.js";
import headerView from "./views/headerView.js";
import noNotesView from "./views/noNotesView.js";

import { DEBUG_STATE, LOCAL_STORAGE_NOTES, DEBUG_MODE } from "./config.js";

////////////////////////////////////////////
// Header Controls

/**
 * Handles creation of new note. Checks the id of the element that executed the callback. If the element has an id, the note is loaded. If the element has no id e.g. this is a new note, then create a new note in the model, the load it into the note editor and add it to the notes view. The "no notes" message is removed.
 * @this {Element} The element that called the function.
 * @todo Determine if id check is needed. May be able to remove "this".
 * @todo Refactor to leverage other existing functions. Add the note to the notes view and the model, then open that note.
 */
const controlHeaderViewCreateNewNote = function () {
  // Read the ID of the element that initiated the function (if it exists).
  let id = this.dataset?.id ?? -1;
  // If this is a new note, a new ID and note must be made
  if (id === -1) {
    id = model.createNewNote();
  }

  try {
    // Load the note as the current note in the model
    // console.log(model.state);
    model.loadNote(Number(id));

    //Load the note in the editNote view and the notesView
    editNoteView.renderNote(
      model.state.currentNote.title,
      model.state.currentNote.text,
      model.state.currentNote.color
    );

    _notesViewRenderNote(
      model.state.currentNote.id,
      model.state.currentNote.title,
      model.state.currentNote.text,
      model.state.currentNote.color
    );

    _noNotesViewUpdate();
  } catch (error) {
    console.error(error);
  }
};

////////////////////////////////////////////
// noNotesView Controls
/**
 * Creates a new note when the "Create New Note" button on the "No Notes" message is pressed. Calls {@see controlHeaderViewCreateNewNote} by passing the notesView object as "this".
 * @todo Consolidate this and {@see controlHeaderViewCreateNote} into a singular function.
 */
const controlNoNotesViewCreateNote = function () {
  controlHeaderViewCreateNewNote.call(notesView);
};

////////////////////////////////////////////
// NotesView Controls
/**
 * Handles deletion of a note from the notesView when a specific note's delete button is pressed. Removes the note from the notes view. Deletes the note from the model. Saves the model notes array to local storage. Checks if the "no notes" message should be displayed.
 * @this {Element} The note element that is being removed.
 */
const controlNotesViewDeleteNote = function () {
  notesView.removeNote(this);
  model.deleteNote(Number(this.dataset.id));
  controlLocalStorageSaveNotes();
  _noNotesViewUpdate();
};

/**
 * Handles the documentation of a note changing color via a specific note's color picker. Saves the note to the data model using the new color and existing information about the note.
 * @this {Element} The note element that is being altered.
 */
const controlNotesViewChangeNoteColor = function () {
  model.saveNote(this.dataset.id, undefined, undefined, this.dataset.color);
  controlLocalStorageSaveNotes();
};

/**
 * Handles the opening of a note when a specific note is clicked. The note is loaded from the data model into the current note slot. The note information is then rendered in the note editor.
 * @this {Element} The note element being opened.
 * @todo Add error handling.
 */
const controlNotesViewOpenNote = function () {
  try {
    model.loadNote(Number(this.dataset?.id));

    // Load the note in the view
    editNoteView.renderNote(
      model.state.currentNote.title,
      model.state.currentNote.text,
      model.state.currentNote.color,
      model.state.currentNote.isNewNote
    );
  } catch (error) {}
};

////////////////////////////////////////////
// Note Editor Controls
/**
 * Handles editing the note in the data model. Executed at several events when a note is being edited in the note editor, including: When the text being edited is no longer in focus; when the note being edited changes color via the color picker selection. The state of the note in the note editor is retrieved, then updated in the model and on the note's representation in the notes view.
 */
const controlNoteEditorUpdateNoteModel = function () {
  const [title, text, color] = editNoteView.getNoteState();
  model.editCurrentNote(title, text, color);

  notesView.updateNoteContents(
    model.state.currentNote.id,
    model.state.currentNote.title,
    model.state.currentNote.text,
    model.state.currentNote.color
  );
};

/**
 * Handles the closing of the note editor. Triggered by exiting the note editor via pressing the "Escape" key, clicking out of the note, or clicking the close button. If the note in the editor is untouched (e.g. the note is blank), the note is deleted via the {@see controlNoteEditorDelete} method. Otherwise, the model saves the current note information to the model's notes array (long-term storage). The notesView representation of the note is updated. The current note is then unloaded and the editor is closed. Localstorage is then updated with the data model. Checks if the "no notes" message should be displayed. Relies on the information stored about the current note being up-to-date.
 * @returns {null}
 */
const controlNoteEditorClose = function () {
  if (!editNoteView.noteTouched) {
    controlNoteEditorDelete();
    return;
  }

  model.saveCurrentNote();

  notesView.updateNoteContents(
    model.state.currentNote.id,
    model.state.currentNote.title,
    model.state.currentNote.text,
    model.state.currentNote.color
  );

  model.unloadCurrentNote();

  editNoteView.closeNoteEditor();

  controlLocalStorageSaveNotes();

  _noNotesViewUpdate();
};

/**
 * Handles a note being deleted via the press of the "delete" button in the note editor. The note editor is first closed. The note is the removed from the notesView via its id. The note is deleted from the data model and the currentNote information is reset to defaults (unloaded). LocalStorage is updated. Checks if the "no notes" message should be displayed.
 */
const controlNoteEditorDelete = function () {
  editNoteView.closeNoteEditor();

  notesView.removeNoteByID(model.state.currentNote.id);
  model.deleteNote();
  model.unloadCurrentNote();
  controlLocalStorageSaveNotes();
  _noNotesViewUpdate();
};

/**
 * Handles the press of the escape button when in using the note editor. Distinguised from {@see controlNoteEditorClose} due to the order of operations when the "escape" key is pressed. When the "escape" key is pressed, that event fires first, followed by the focusout event. The current note information is only updated when the text areas in the note editor lose focus (thus triggering the focusout chain of events). The Esc event happens first. Thus, if we were to close the note editor at that point, the most-current note information would not be saved into the data model; the previously-captured current note information would be instead. So, this method updates the model with the currentNote information before calling the {@see controlNoteEditorClose} method.
 * If the note in the editor is untouched (e.g. the note is blank), the note is deleted via the {@see controlNoteEditorDelete} method. The data model currentNote information is updated, then the {@see controlNoteEditorClose} method is called.
 * @returns {null}
 * @todo Determine if there is a less redundant way to handle closing the note editor such that all closing methods can share a control method. Would likely involve a flag indicating a change in the text body or a re-organization of the note-updating order of operations.
 */
const controlNoteEditorEscapeButton = function () {
  if (!editNoteView.noteTouched) {
    controlNoteEditorDelete();
    return;
  }
  controlNoteEditorUpdateNoteModel();
  controlNoteEditorClose();
};

////////////////////////////////////////////
// Local Storage Interactions
/**
 * Loads any note information from LocalStorage. Populates the note model with the information found, then renders each note with any required event handlers, etc. Checks if the "no notes" message should be displayed. If any errors occur during loading, they are caught and logged in the console.
 * @returns {null}
 */
const controlLocalStorageLoadNotes = function () {
  try {
    const notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTES));
    model.populateNoteModel(notes);
    model.state.notes.forEach((note) =>
      _notesViewRenderNote(note.id, note.title, note.text, note.color)
    );
    _noNotesViewUpdate();
  } catch (err) {
    // Problem with JSON file. Locally stored files not loaded:
    console.error("💥 Error during LocalStorage load: 💥\n", err);
    return;
  }
};

/**
 * Saves the model notes array to localStorage, overwriting whatever was there previously.
 */
const controlLocalStorageSaveNotes = function () {
  localStorage.setItem(LOCAL_STORAGE_NOTES, JSON.stringify(model.state.notes));
};

////////////////////////////////////////////
// Controller Functions
/**
 * Internal controller function that handles the rendering of a note based on the information provided. Renders the note in the notes view using the provided information. Attaches handlers for delete note button, clicking on the note, and the note's color picker.
 * @param {Number} id - The id of the note to be updated.
 * @param {String} title - The title of the note to be updated.
 * @param {String} text - The text body of the note to be updated.
 * @param {String} color - The color of the note to be updated. Must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js} in order to properly render.
 */
const _notesViewRenderNote = function (id, title, text, color) {
  const note = notesView.renderNote(id, title, text, color);

  // Add note event handlers
  notesView.addHandlerDeleteNoteButton(controlNotesViewDeleteNote, note);
  notesView.addHandlerClickNote(controlNotesViewOpenNote, note);
  notesView.addHandlersColorPickerNote(controlNotesViewChangeNoteColor, note);
};

/**
 * Internal controller function that updates the noNotes view. If there are no notes displayed in the notesView, the noNotesView is displayed and the "create note" buttons are highlighted. If there are notes being displayed, the noNotesView is hidden and the "create note" buttons are no longer highlighted.
 */
const _noNotesViewUpdate = function () {
  if (notesView.isEmpty()) {
    noNotesView.render();
    headerView.highlightNewNoteButton();
  } else {
    noNotesView.hide();
    headerView.unHighlightNewNoteButton();
  }
};

/**
 * Initializes the application. Allows for debug code to be run if the DEBUG_MODE flag in {@link ../config.js} is set to TRUE. Any notes in localStorage are loaded. Handlers for the header, editNoteView, and noNotesView are added.
 */
const init = function () {
  if (DEBUG_MODE) {
    model.state.notes = DEBUG_STATE.notes;
    model.state.idLedger = DEBUG_STATE.idLedger;
  }
  controlLocalStorageLoadNotes();

  headerView.addHandlerNewNoteButton(controlHeaderViewCreateNewNote);
  editNoteView.addHandlerTextElementsFocusOut(controlNoteEditorUpdateNoteModel);
  editNoteView.addHandlersCloseNote(controlNoteEditorClose);
  editNoteView.addHandlerDeleteButton(controlNoteEditorDelete);
  editNoteView.addHandlersColorPicker(controlNoteEditorUpdateNoteModel);
  editNoteView.addHandlerTextElementsFocusIn();
  editNoteView.addHandlersEnterKey();
  editNoteView.addHandlerEscapeKey(controlNoteEditorEscapeButton);
  noNotesView.addHandlerNewNoteButton(controlNoNotesViewCreateNote);
};

////////////////////////////////////////////
init();
