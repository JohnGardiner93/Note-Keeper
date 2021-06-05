"use strict";
/**
 * Data model for NoteKeeper App. Handles creation, storage, and deletion of notes as dicated by controller and internal rules
 * @module model.js
 */

import { NOTE_COLORS } from "./config.js";
import { DEFAULT_NOTE_TEXT } from "./config.js";

/**
 * @exports state - The state of the data model. Includes:
 * notes - The notes that are currently displayed on the page.
 * currentNote - The information about the current note being displayed, if any.
 * idLedger - The next id number in the note id sequence.
 */
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

/**
 * Creates a note using the information given.
 */
class Note {
  /**
   * Creates a new note. Runs provided arguments through set methods as part of validation.
   * @param {String} title - Title of the note.
   * @param {String} text - Text content of the note.
   * @param {String} color - Color of the note. Must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js} in order to properly render.
   * @param {Number} id - ID number of the note.
   * @param {Boolean} isNewNote - Indicator of whether the note is new or not.
   */
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
  /**
   * Set the title of the note. Converts provided input into string
   * @param {String} title - Desired title of the note.
   */
  set title(title) {
    this._title = "" + title;
  }

  /**
   * Get the title of the note.
   * @returns {String} - The title of the note
   */
  get title() {
    return this._title;
  }

  /**
   * Set the text of the note. Converts provided input into string
   * @param {String} text - Desired text of the note.
   */
  set text(text) {
    this._text = "" + text;
  }

  /**
   * Get the text of the note.
   * @returns {String} - The text of the note.
   */
  get text() {
    return this._text;
  }

  /**
   * Set the id of the note. Tries to use provided input. If the input is not a number and it's nonzero, it is used. Otherwise, the id is set to -2.
   * @param {Number} id - Desired id of the note.
   */
  set id(id) {
    this._id = Number.isFinite(id) && id >= 0 ? id : -2;
  }

  /**
   * Get the id of the note.
   * @returns {Number} - The id of the note.
   */
  get id() {
    return this._id;
  }

  /**
   * Sets the color of the note. Provided color must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js}. If not, the note color defaults to NOTE_COLORS[0]
   * @param {String} color - The desired color of the note.
   */
  set color(color) {
    this._color = NOTE_COLORS.includes(color) ? color : NOTE_COLORS[0];
  }

  /**
   * Get the color of the note.
   * @returns {String} The color of the note.
   */
  get color() {
    return this._color;
  }

  /**
   * Set the isNewNote flag.
   * @param {Boolean} isNewNote
   * @todo Validate isNewNote input.
   */
  set isNewNote(isNewNote) {
    this._isNewNote = isNewNote;
  }

  /**
   * Get the isNewNote flag value.
   * @returns {Boolean} The status of the isNewNote value.
   */
  get isNewNote() {
    return this._isNewNote;
  }
}

/**
 * Loads a note from the model notes array, if it exists. Loads by setting currentNote properties to the properties of the requested note.
 * @param {Number} id - The id number of the note to be loaded.
 * @todo Refactor to stop using _noteIDExists and just use _retreiveNoteIndex. These are essentially redundant.
 */
export const loadNote = function (id) {
  // Check if the note exists
  if (!_noteIDExists(id)) {
    throw new Error(`Note ID Does not exist`);
  }

  const note = state.notes[_retrieveNoteIndex(id)]; // Get the note

  // Load the note
  state.currentNote.title = note.title;
  state.currentNote.text = note.text;
  state.currentNote.color = note.color;
  state.currentNote.id = note.id;
};

/**
 * Creates a new note, assigns it an ID, marks it as a new note, adds it to the data model, and returns the id of the note that was created.
 * @returns {Number} The id of the note that was just created.
 */
export const createNewNote = function () {
  const note = new Note();
  note.id = _generateNextID();
  note.isNewNote = true;
  _addNoteToList(note);
  return note.id;
};

/**
 * Returns the current idLedger number as the next acceptable id number, then increments the ledger forward by 1.
 * @returns {Number} The next id acceptable according to the idLedger.
 * @todo Implement unique ID algorithm/system.
 */
const _generateNextID = function () {
  const id = state.idLedger;
  state.idLedger++;
  return id;
};

/**
 * Adds the provided note to the state notes array. If the noteID already exists, the note is not added and an error is thrown.
 * @param {Note} note - The note to add to the state notes array.
 */
const _addNoteToList = function (note) {
  if (_noteIDExists(note.id))
    throw new Error(`The note you are trying to add already exists`);
  state.notes.push(note);
};

/**
 * Determines if a note id is already present in the state's notes array.
 * @param {Number} id - The note id to be searched.
 * @returns {Boolean} - True - The note id provided is in the state's notes array already. False - The note id provided is not in the state's notes array.
 */
const _noteIDExists = function (id) {
  // See if note ID is already in list
  return state.notes.some((item) => item.id === Number(id));
};

/**
 * Retrieves the index of the first note with the provided id within the state's note array.
 * @param {Number} id - The id of the desired note.
 * @returns {Number} - The index of the desired note within the state note array. Returns -1 if the note is not found.
 */
const _retrieveNoteIndex = function (id) {
  return state.notes.findIndex((note) => note.id === id);
};

/**
 * Updates the contents of the current note using the information provided.
 * @param {String} title - Title of the note.
 * @param {String} text - Text content of the note.
 * @param {String} color - Color of the note. Must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js} in order to properly render.
 * @todo Refactor so that the state uses an actual Note object. Then, validation will only happen in one place.
 */
export const editCurrentNote = function (title, text, color) {
  state.currentNote.title = title.toString();
  state.currentNote.text = text.toString();
  state.currentNote.color = NOTE_COLORS.includes(color)
    ? color
    : NOTE_COLORS[0];
};

/**
 * Saves the current note's data to its location in the state notes array
 */
export const saveCurrentNote = function () {
  this.saveNote(
    state.currentNote.id,
    state.currentNote.title,
    state.currentNote.text,
    state.currentNote.color
  );
};

/**
 * Unloads the current note by setting all of the parameters to default values.
 * @todo Add default for isNewNote flag
 */
export const unloadCurrentNote = function () {
  state.currentNote.title = DEFAULT_NOTE_TEXT[2];
  state.currentNote.text = DEFAULT_NOTE_TEXT[2];
  state.currentNote.color = `none`;
  state.currentNote.id = -1;
};

/**
 * Deletes a note from the state notes array. If the argument passed is blank, the current note is deleted.
 * @param {Number} id - The id of the number to be deleted.
 */
export const deleteNote = function (id) {
  //Allow for blank pass into deleteNote to indicate delete current note
  const noteID = id ?? state.currentNote.id;
  state.notes = state.notes.filter((note) => note.id !== noteID);
};

/**
 * Saves the provided information to the note in the state notes array that has the provided id. Only allows pre-existing notes to be saved. If a new note is to be made, use createNewNote. If the note ID does not exist in the state notes array, an error is thrown. Empty arguments can be provided for title, text, and color. When empty arguments are provided, the corresponding note data in the state notes array will not change.
 * @param {String} title - Title of the note.
 * @param {String} text - Text content of the note.
 * @param {String} color - Color of the note. Must be within pre-defined set of colors (NOTE_COLORS) as seen in {@link ../config.js} in order to properly render.
 * @param {Number} id - ID number of the note.
 * @see createNewNote
 */
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

/**
 * Takes array of objects with note-like properties and makes them into Notes. Adds them to state notes array. Also sets idLedger based on id's of notes received. The idLedger will be set to the largest id size. Used when pulling stored notes from localStorage. Attempts to catch and correct any data inconsistencies and purge them from the notes state ({@see checkModelForErrors}}).
 * @param {Array} notes - The objects to be used to construct Note objects.
 * @todo Recompose to copy the state, then attempt to add notes, check the notes for errors, then overwrite the state.
 */
export const populateNoteModel = function (notes) {
  // Get largest ID from saved notes while creating new notes
  const maxID = notes.reduce((id, note) => {
    // Need to reconstruct notes that came from local storage to reestablish protype chain, etc.
    const newNote = new Note(
      note?._title,
      note?._text,
      note?._color,
      note?._id
    );
    state.notes.push(newNote);

    // Return the larger id to the accumulator in an attempt to find the largest id. Would be handled differently with different ID scheme.
    return +note._id > id ? +note._id : id;
  }, 0);
  // Adjust ID ledger to the max note id found from the notes that were read.
  state.idLedger = maxID + 1;

  checkModelForErrors();
};

/**
 * Checks the state's notes array for errors. Errors are returned. Errors are fixed by default, but a false value can be passed to disable this. Checks the notes array for the following errors:
 * - Blank note (e.g. blank title and text)
 * - Invalid ID (ID must be non-negative numerical id and must not be a duplicate)
 * If a true value is passed into this function, blank notes are removed from the state notes array. Notes with invalid id's are given new id's. The state is refreshed with the cleaned up notes array.
 * @param {*} fixErrors
 * @todo Rewrite so that the state notes array is not directly altered until the very end of the operation, if at all.
 */
const checkModelForErrors = function (fixErrors = true) {
  // GATHER ERRORS
  // Gathers the errors of each note in the model into an accumulator so that the information can be referenced and fixed (if desired)
  const modelErrors = state.notes.reduce(
    (err, note, location) => {
      // BLANK NOTE
      // If there's no note title and no note text, this really isn't a note. Flag the note for deletion and end the error sweep on this note
      if (note?.text.trim() === "" && note?.title.trim() === "") {
        err[location] = `blank note`;
        return err;
      }

      // INVALID ID
      // Check that the id is valid -> has a non-negative numerical id that is not already used by another note
      if (
        !Number.isFinite(note?.id) ||
        note?.id < 0 ||
        err.ids.includes(note?.id)
      )
        err[location] = `invalid id`;

      // Keep a record of all the note ids that are cycled through so that we can check for duplicates later.
      err.ids.push(note?.id);

      // NO ERROR
      if (!err[location]) err[location] = `no error`;
      return err;
    },
    { errors: [], ids: [] }
  );
  // console.log(`model errors`, modelErrors);

  // FIX ERRORS (?)
  // Fix errors if requested and if there are any errors.
  if (fixErrors && modelErrors) {
    const newModelNotesState = state.notes.reduce((notes, note, i) => {
      if (modelErrors[i] === `blank note`) return notes;
      if (modelErrors[i].includes("id")) {
        note.id = _generateNextID();
      }
      notes.push(note);
      return notes;
    }, []);
    // console.log(`Here's the clean notes:`, newModelNotesState);
    state.notes = newModelNotesState;
  }
};
