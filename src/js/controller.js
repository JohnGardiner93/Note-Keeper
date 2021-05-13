"use strict";

import * as model from "./model.js";
import notesView from "./views/notesView.js";
import editNoteView from "./views/editNoteView.js";
import headerView from "./views/headerView.js";

import { DEBUG_STATE, LOCAL_STORAGE_NOTES } from "./config.js";
import { DEBUG_MODE } from "./config.js";

////////////////////////////////////////////
// Header Controls
const controlHeaderViewCreateNewNote = function () {
  // Read the ID of the element that initiated the function (if it exists)
  let id = this.dataset?.id ?? -1;
  // If this is a new note, a new ID and note must be made
  if (id === -1) {
    id = model.createNewNote();
    console.log(`Here is the new id`, id);
  }

  try {
    // Load the note as the current note in the model
    console.log(model.state);
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
  } catch (error) {
    console.error(error);
  }
};

////////////////////////////////////////////
// NotesView Controls
const controlNotesViewDeleteNote = function () {
  notesView.removeNote(this);
  model.deleteNote(Number(this.dataset.id));
  controlLocalStorageSaveNotes();
};

const controlNotesViewChangeNoteColor = function () {
  console.log(`controller view notes change color`, this);
  model.saveNote(this.dataset.id, undefined, undefined, this.dataset.color);
  controlLocalStorageSaveNotes();
};

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
const controlNoteEditorUpdateNoteModel = function () {
  // Get note data
  const [title, text, color] = editNoteView.getNoteState();
  console.log(title, text, color);
  // Edit the note data in the model
  model.editCurrentNote(title, text, color);
};

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
};

const controlNoteEditorDelete = function () {
  editNoteView.closeNoteEditor();

  notesView.removeNoteByID(model.state.currentNote.id);
  model.deleteNote();
  model.unloadCurrentNote();
  controlLocalStorageSaveNotes();
};

const controlNoteEditorEscapeButton = function () {
  controlNoteEditorUpdateNoteModel();
  controlNoteEditorClose();
};

////////////////////////////////////////////
// Local Storage Interactions
const controlLocalStorageLoadNotes = function () {
  const notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTES));
  if (!notes) return;
  model.populateNoteModel(notes);
  model.state.notes.forEach((note) =>
    _notesViewRenderNote(note.id, note.title, note.text, note.color)
  );
};

const controlLocalStorageSaveNotes = function () {
  localStorage.setItem(LOCAL_STORAGE_NOTES, JSON.stringify(model.state.notes));
};

////////////////////////////////////////////
// Controller Functions
const _notesViewRenderNote = function (id, title, text, color) {
  const note = notesView.renderNote(id, title, text, color);

  // Add note event handlers
  notesView.addHandlerDeleteNoteButton(controlNotesViewDeleteNote, note);
  notesView.addHandlerClickNote(controlNotesViewOpenNote, note);
  notesView.addHandlersColorPickerNote(controlNotesViewChangeNoteColor, note);
};

const init = function () {
  if (DEBUG_MODE) {
    model.state.notes = DEBUG_STATE.notes;
    model.state.idLedger = DEBUG_STATE.idLedger;
  }
  controlLocalStorageLoadNotes();

  headerView.addHandlerNewNoteButton(controlHeaderViewCreateNewNote);
  editNoteView.addHandlerTextElementsFocusOut(controlNoteEditorUpdateNoteModel);
  editNoteView.addHandlerCloseButton(controlNoteEditorClose);
  editNoteView.addHandlerDeleteButton(controlNoteEditorDelete);
  editNoteView.addHandlersColorPicker(controlNoteEditorUpdateNoteModel);
  editNoteView.addHandlerTextElementsFocusIn();
  editNoteView.addHandlerEscapeKey(controlNoteEditorEscapeButton);
};

////////////////////////////////////////////
init();
