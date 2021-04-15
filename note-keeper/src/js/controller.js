'use strict';

import * as model from './model.js';
import notesView from './views/notesView.js';
import editNoteView from './views/editNoteView.js';
import headerView from './views/headerView.js';

////////////////////////////////////////////
// Notes View Controls
const controlNotesViewOpenNote = function () {
  // 1. Read the ID of the element that initiated the function (if it exists)
  let id = this.dataset?.id ?? -1;
  // 2. If this is a new note, a new ID and note must be made
  if (id === -1) {
    id = model.createNewNote();
    console.log(`Here is the new id`, id);
  }

  try {
    // 3. Load the note in the model
    model.loadNote(id);

    // 4. Load the note in the view
    editNoteView.renderNote(
      model.state.currentNote.title,
      model.state.currentNote.text
    );
  } catch (error) {
    console.error(error);
  }
};

const controlNotesViewDeleteNote = function () {};

const controlNotesViewChangeNoteColor = function () {};

////////////////////////////////////////////
// Note Editor Controls
const controlNoteEditorSave = function () {
  // Get note data
  const [title, text, color] = editNoteView.getNoteState();
  console.log(title, text, color);
  // Save the note data in the model
  model.editCurrentNote(title, text, color);
  model.saveCurrentNote();
};

const controlNoteEditorClose = function () {
  model.saveCurrentNote();
  // Close the note editor
  model.unloadCurrentNote();

  editNoteView.closeNoteEditor();
};

const controlNoteEditorDelete = function () {
  editNoteView.closeNoteEditor();

  model.deleteNote();
  model.unloadCurrentNote();
};

const controlNoteEditorChangeNoteColor = function () {};

////////////////////////////////////////////
// Header Controls
const controlHeaderBackToMainPage = function () {};

const init = function () {
  headerView.addHandlerNewNoteButton(controlNotesViewOpenNote);
  editNoteView.addHandlersFocusOut(controlNoteEditorSave);
  editNoteView.addHandlerCloseButton(controlNoteEditorClose);
  editNoteView.addHandlerDeleteButton(controlNoteEditorDelete);
};

init();

// btnAddNote.addEventListener(`click`, renderNoteEditor);
// btnEditorClose.addEventListener(`click`, closeNoteEditor);

// notesView.addHandlerNoteDisplay(controlNoteEditor);
