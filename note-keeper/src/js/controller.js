'use strict';

import * as model from './model.js';
import notesView from './views/notesView.js';
import editNotesView from './views/editNoteView.js';

// Get Elements
const notesContainerEl = document.querySelector(`.container--notes`);
const noteElements = notesContainerEl.querySelectorAll(`.note`);
const btnAddNote = document.querySelector(`.btn--new-note`);

const noteEditorWindowEl = document.querySelector(`.modal--background`);
const noteEditorNoteTitleEl = noteEditorWindowEl.querySelector(
  `.modal--note-title`
);
const noteEditorNoteTextEl = noteEditorWindowEl.querySelector(
  `.modal--note-text`
);
const btnEditorClose = noteEditorWindowEl.querySelector(`.btn--modal--close`);

console.log(noteElements);

// Variables
const notesList = [];

// Functions

////////////////////////////////////////////
// Add Event Listeners
// Main Page
btnAddNote.addEventListener(`click`, renderNoteEditor);

// Note Editor
btnEditorClose.addEventListener(`click`, closeNoteEditor);

// Main Code

////////////////////////////////////////////
// Test Code

// noteElements.forEach(el => el.addEventListener);
