'use strict';

import * as model from './model.js';
import notesView from './views/notesView.js';
import editNotesView from './views/editNoteView.js';
import headerView from './views/headerView.js';

const controlNoteEditor = function () {
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
    editNotesView.renderNote(
      model.state.currentNote.title,
      model.state.currentNote.text
    );
  } catch (error) {
    console.error(error);
  }
};

const controlNoteEditorCloseButton = function () {
  // model.state.currentNote.title = editNotesView.
};

const init = function () {
  headerView.addHandlerNewNoteButton(controlNoteEditor);
};

init();

// btnAddNote.addEventListener(`click`, renderNoteEditor);
// btnEditorClose.addEventListener(`click`, closeNoteEditor);

// notesView.addHandlerNoteDisplay(controlNoteEditor);
