export const state = {
  notes: [],
};

class Note {
  _title = ``;
  _text = ``;
  _color = `yellow`;
  _id = -1;

  constructor(title, text, color, id) {
    this._title = title;
    this._text = text;
    this._color = color;
    this._id = id;
  }

  set title(title) {
    this._title = title;
  }

  get title() {
    return this._title;
  }

  set text(text) {
    this._title = text;
  }

  get text() {
    return this._title;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }
}
