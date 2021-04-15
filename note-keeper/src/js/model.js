'use strict';
import { NOTE_COLORS } from './config.js';
import { DEFAULT_NOTE_TEXT } from './config.js';

export const state = {
  notes: [],
  currentNote: {
    title: DEFAULT_NOTE_TEXT[2],
    text: DEFAULT_NOTE_TEXT[2],
    color: NOTE_COLORS[0],
    id: -1,
  },
  idLedger: 0,
};

class Note {
  constructor(
    title = DEFAULT_NOTE_TEXT[0],
    text = DEFAULT_NOTE_TEXT[1],
    color = NOTE_COLORS[0],
    id = -1
  ) {
    this._title = title;
    this._text = text;
    this._color = color;
    this._id = id;
  }

  set title(title) {
    if (!title) return;
    this._title = title;
  }

  get title() {
    return this._title;
  }

  set text(text) {
    if (!text) return;
    this._title = text;
  }

  get text() {
    return this._text;
  }

  set id(id) {
    if (!(Number.isFinite(id) && id >= 0)) return;
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set color(color) {
    if (!NOTE_COLORS.includes(color)) return;
    this._color = color;
  }

  get color() {
    return this._color;
  }
}

export const loadNote = function (id) {
  // Check if the note exists
  if (!_noteIDExists(id)) {
    throw new Error(`Note ID Does not exist`);
  }

  // Get the note
  // const [note] = state.notes.filter(note => note.id === id);
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
  _addNoteToList(note);
  return note.id;
};

const _generateNextID = function () {
  const id = state.idLedger;
  state.idLedger++;
  // console.log(`Generated ID ${id}`);
  return id;
};

const _addNoteToList = function (note) {
  if (_noteIDExists(note.id))
    throw new Error(`The note you are trying to add already exists`);
  state.notes.push(note);
};

const _noteIDExists = function (id) {
  // See if note ID is already in list
  return state.notes.some(item => item.id === id);
};

const _retrieveNoteIndex = function (id) {
  return state.notes.findIndex(note => note.id === id);
};

export const editCurrentNote = function (title, text, color) {
  // if (!(id === state.currentNote.id))
  //   throw new Error(
  //     `ID of the note you are attempting to edit does not match the model's currently registered ID. Edit aborted`
  //   );
  console.log(`Editing Note`);
  state.currentNote.title = title.toString();
  state.currentNote.text = text.toString();
  state.currentNote.color = NOTE_COLORS.includes(color)
    ? color
    : NOTE_COLORS[0];
  console.log(title, text, color);
  console.log(`editCurrentNOte`, state.currentNote);
};

export const saveCurrentNote = function () {
  if (!_noteIDExists(state.currentNote.id))
    throw new Error(
      `The note ID you are trying to save is not registered. Save operation aborted`
    );

  const noteIndex = _retrieveNoteIndex(state.currentNote.id);

  // Object.assign(state.notes[noteIndex], {
  //   title: state.currentNote.title,
  //   text: state.currentNote.text,
  //   color: NOTE_COLORS.includes(state.currentNote.color)
  //     ? state.currentNote.color
  //     : NOTE_COLORS[0],
  // });

  state.notes[noteIndex].title = state.currentNote.title;
  state.notes[noteIndex].text = state.currentNote.text;
  state.notes[noteIndex].color = state.currentNote.color;

  console.log(state.notes[noteIndex]);
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
  console.log(`Before deleting`, state.notes);
  state.notes = state.notes.filter(note => note.id !== noteID);
  console.log(`After deleting`, state.notes);
};
