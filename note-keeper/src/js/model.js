'use strict';
import { NOTE_COLORS } from './config.js';

export const state = {
  notes: [],
  currentNote: {
    title: ``,
    text: ``,
    color: `yellow`,
    id: -1,
  },
  idLedger: 0,
};

class Note {
  constructor(
    title = `Note Title`,
    text = `Note Text`,
    color = `yellow`,
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
  const [note] = state.notes.filter(note => note.id === id);

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
  if (_noteIDExists(note.id)) return;
  state.notes.push(note);
};

const _noteIDExists = function (id) {
  // See if note ID is already in list
  return state.notes.some(item => item.id === id);
};
