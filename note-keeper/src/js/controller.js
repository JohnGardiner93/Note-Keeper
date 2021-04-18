'use strict';

import * as model from './model.js';
import notesView from './views/notesView.js';
import editNoteView from './views/editNoteView.js';
import headerView from './views/headerView.js';

import { DEBUG_STATE } from './config.js';
import { DEBUG_MODE } from './config.js';

////////////////////////////////////////////
// Notes View Controls
const controlNotesViewCreateNewNote = function () {
  // Read the ID of the element that initiated the function (if it exists)
  // console.log(this);
  // console.log(this.dataset?.id);
  let id = this.dataset?.id ?? -1;
  // console.log(id);
  // If this is a new note, a new ID and note must be made
  if (id === -1) {
    id = model.createNewNote();
    console.log(`Here is the new id`, id);
  }

  try {
    // 3. Load the note in the model
    console.log(model.state);
    model.loadNote(Number(id));

    // 4. Load the note in the view
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
  } catch (error) {
    console.error(error);
  }
};

const controlNotesViewDeleteNote = function () {
  notesView.removeNote(this);
  model.deleteNote(Number(this.dataset.id));
};

const controlNotesViewChangeNoteColor = function () {
  console.log(`controller view notes change color`, this);
  model.saveNote(this.dataset.id, undefined, undefined, this.dataset.color);
};

const controlNotesViewOpenNote = function () {
  try {
    model.loadNote(Number(this.dataset?.id));

    // 4. Load the note in the view
    editNoteView.renderNote(
      model.state.currentNote.title,
      model.state.currentNote.text,
      model.state.currentNote.color
    );
  } catch (error) {}
};

////////////////////////////////////////////
// Note Editor Controls
const controlNoteEditorUpdateNoteModel = function () {
  // Get note data
  const [title, text, color] = editNoteView.getNoteState();
  console.log(title, text, color);
  // Edit the note data in the model
  model.editCurrentNote(title, text, color);
};

// const controlNoteEditorHighlightTextField = function () {};

const controlNoteEditorClose = function () {
  model.saveCurrentNote();

  notesView.updateNoteContents(
    model.state.currentNote.id,
    model.state.currentNote.title,
    model.state.currentNote.text,
    model.state.currentNote.color
  );

  model.unloadCurrentNote();

  // Close the note editor
  editNoteView.closeNoteEditor();
};

const controlNoteEditorDelete = function () {
  editNoteView.closeNoteEditor();

  notesView.removeNoteByID(model.state.currentNote.id);
  model.deleteNote();
  model.unloadCurrentNote();
};

// const controlNoteEditorChangeNoteColor = function () {};

const _notesViewRenderNote = function (id, title, text, color) {
  // ADD UPDATE VS NEW NOTE PATH
  const note = notesView.renderNote(id, title, text, color);

  // Add note event handlers
  notesView.addHandlerDeleteNoteButton(controlNotesViewDeleteNote, note);
  notesView.addHandlerClickNote(controlNotesViewOpenNote, note);
  notesView.addHandlersColorPickerNote(controlNotesViewChangeNoteColor, note);
};

////////////////////////////////////////////
// Header Controls
const controlHeaderBackToMainPage = function () {};

////////////////////////////////////////////
const init = function () {
  if (DEBUG_MODE) {
    model.state.notes = DEBUG_STATE.notes;
    model.state.idLedger = DEBUG_STATE.idLedger;
  }
  model.state.notes.forEach(note =>
    _notesViewRenderNote(note.id, note.title, note.text, note.color)
  );
  headerView.addHandlerNewNoteButton(controlNotesViewCreateNewNote);
  editNoteView.addHandlerTextElementsFocusOut(controlNoteEditorUpdateNoteModel);
  editNoteView.addHandlerCloseButton(controlNoteEditorClose);
  editNoteView.addHandlerDeleteButton(controlNoteEditorDelete);
  editNoteView.addHandlersColorPicker(controlNoteEditorUpdateNoteModel);
  editNoteView.addHandlerTextElementsFocusIn();
};

init();

// btnAddNote.addEventListener(`click`, renderNoteEditor);
// btnEditorClose.addEventListener(`click`, closeNoteEditor);

// notesView.addHandlerNoteDisplay(controlNoteEditor);
