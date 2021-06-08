"use strict";

/**
 * Configuration information for application
 * @module config
 */

/**
 * Allowable note color strings.
 * @constant
 */
export const NOTE_COLORS = [`yellow`, `blue`, `red`, `green`, `purple`];

/**
 * Default note text variables.
 * @constant
 */
export const DEFAULT_NOTE_TEXT = [`Note Title`, `Note Text`, `Not Loaded`];

/**
 * Name of the localStorage variable.
 * @constant
 */
export const LOCAL_STORAGE_NOTES = `notekeepernotes`;

/**
 * Debug mode. TRUE = enabled, FALSE = disabled
 * @constant
 */
export const DEBUG_MODE = false;

/**
 * Debugging constants
 * @constant
 */
export const DEBUG_STATE = {
  notes: [
    {
      title: `${DEFAULT_NOTE_TEXT[0]} 0`,
      text: `${DEFAULT_NOTE_TEXT[1]} 0`,
      color: NOTE_COLORS[0],
      id: 0,
      isNewNote: false,
    },
    {
      title: `${DEFAULT_NOTE_TEXT[0]} 1`,
      text: `${DEFAULT_NOTE_TEXT[1]} 1`,
      color: NOTE_COLORS[1],
      id: 1,
      isNewNote: false,
    },
    {
      title: `${DEFAULT_NOTE_TEXT[0]} 2`,
      text: `${DEFAULT_NOTE_TEXT[1]} 2`,
      color: NOTE_COLORS[2],
      id: 2,
      isNewNote: false,
    },
  ],
  currentNote: {
    title: DEFAULT_NOTE_TEXT[2],
    text: DEFAULT_NOTE_TEXT[2],
    color: NOTE_COLORS[0],
    id: -1,
    isNewNote: false,
  },
  idLedger: 3,
};
