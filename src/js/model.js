"use strict";
import { NOTE_COLORS } from "./config.js";
import { DEFAULT_NOTE_TEXT } from "./config.js";

export const state = {
  notes: [],
  currentNote: {
    title: DEFAULT_NOTE_TEXT[2],
    text: DEFAULT_NOTE_TEXT[2],
    color: NOTE_COLORS[0],
    id: -1,
    isNewNote: false,
  },
  idLedger: 0,
};

class Note {
  constructor(
    title = "",
    text = "",
    color = NOTE_COLORS[0],
    id = -1,
    isNewNote = false
  ) {
    this.title = title;
    this.text = text;
    this.color = color;
    this.id = id;
    this.isNewNote = isNewNote;
  }

  set title(title) {
    this._title = "" + title;
  }

  get title() {
    return this._title;
  }

  set text(text) {
    this._text = "" + text;
  }

  get text() {
    return this._text;
  }

  set id(id) {
    this._id = Number.isFinite(id) && id >= 0 ? id : -2;
  }

  get id() {
    return this._id;
  }

  set color(color) {
    this._color = NOTE_COLORS.includes(color) ? color : NOTE_COLORS[0];
  }

  get color() {
    return this._color;
  }

  set isNewNote(isNewNote) {
    this._isNewNote = isNewNote;
  }

  get isNewNote() {
    return this._isNewNote;
  }
}

export const loadNote = function (id) {
  // Check if the note exists
  if (!_noteIDExists(id)) {
    throw new Error(`Note ID Does not exist`);
  }

  // Get the note
  const note = state.notes[_retrieveNoteIndex(id)];

  console.log(note);
  // Load the note
  state.currentNote.title = note.title;
  state.currentNote.text = note.text;
  state.currentNote.color = note.color;
  state.currentNote.id = note.id;
};

export const createNewNote = function () {
  const note = new Note();
  note.id = _generateNextID();
  note.isNewNote = true;
  _addNoteToList(note);
  return note.id;
};

const _generateNextID = function () {
  const id = state.idLedger;
  state.idLedger++;
  return id;
};

const _addNoteToList = function (note) {
  if (_noteIDExists(note.id))
    throw new Error(`The note you are trying to add already exists`);
  state.notes.push(note);
};

const _noteIDExists = function (id) {
  // See if note ID is already in list
  return state.notes.some((item) => item.id === Number(id));
};

const _retrieveNoteIndex = function (id) {
  return state.notes.findIndex((note) => note.id === id);
};

export const editCurrentNote = function (title, text, color) {
  console.log(`Editing Note`);
  state.currentNote.title = title.toString();
  state.currentNote.text = text.toString();
  state.currentNote.color = NOTE_COLORS.includes(color)
    ? color
    : NOTE_COLORS[0];
  console.log(title, text, color);
  console.log(`editCurrentNote`, state.currentNote);
};

export const saveCurrentNote = function () {
  this.saveNote(
    state.currentNote.id,
    state.currentNote.title,
    state.currentNote.text,
    state.currentNote.color
  );
  console.log(`saveCurrentNote`, state.currentNote);
};

export const unloadCurrentNote = function () {
  state.currentNote.title = DEFAULT_NOTE_TEXT[2];
  state.currentNote.text = DEFAULT_NOTE_TEXT[2];
  state.currentNote.color = `none`;
  state.currentNote.id = -1;
};

export const deleteNote = function (id) {
  //Allow for blank pass into deleteNote to indicate delete current note
  const noteID = id ?? state.currentNote.id;
  console.log(`Before deleting ${noteID}`, state.notes);
  state.notes = state.notes.filter((note) => note.id !== noteID);
  console.log(`After deleting`, state.notes);
};

export const saveNote = function (id, title, text, color) {
  const noteID = Number(id);

  if (!_noteIDExists(noteID))
    throw new Error(
      `The note ID you are trying to save is not registered. Save operation aborted`
    );

  const noteIndex = _retrieveNoteIndex(noteID);
  state.notes[noteIndex].title = title ?? state.notes[noteIndex].title;
  state.notes[noteIndex].text = text ?? state.notes[noteIndex].text;
  state.notes[noteIndex].color = color ?? state.notes[noteIndex].color;
};

// Takes array of objects with note-like properties and makes them into Notes. Adds them to model. Also sets idLedger based on id's of notes received
export const populateNoteModel = function (notes) {
  // Create new notes using constructor
  // Get largest ID from saved notes
  const maxID = notes.reduce((id, note) => {
    // Need to reconstruct notes that came from local storage to reestablish protype chain, etc.

    const newNote = new Note(
      note?._title,
      note?._text,
      note?._color,
      note?._id
    );
    state.notes.push(newNote);

    return +note._id > id ? +note._id : id;
  }, 0);
  // Adjust ID ledger
  state.idLedger = maxID + 1;

};
