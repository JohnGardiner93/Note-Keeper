import { computeScrollPosition, pixelsToNumber } from "../helpers.js";

class NotesView {
  _parentEl = document.querySelector(`.container--notes`);

  renderNote(id, title, text, color) {
    // If the note exists, update the note you already have
    const markup = this._generateNoteMarkup(id, title, text, color);
    this._parentEl.insertAdjacentHTML(`beforeend`, markup);
    const note = this._parentEl.lastElementChild;
    this._adjustNoteForTextOverflow(note);
    return note;
  }

  updateNoteContents(id, title, text, color) {
    const note = this._findNote(id);
    const noteTitleEl = note.querySelector(`.note--title`);
    const noteTextEl = note.querySelector(`.note--text-body`);

    noteTitleEl.textContent = title;
    noteTextEl.textContent = text;
    note.dataset.color = color;

    this._adjustNoteForTextOverflow(note);

    return note;
  }

  removeNote(element) {
    element.remove();
    // console.log(element);
  }

  removeNoteByID(id) {
    const note = this._findNote(id);
    this.removeNote(note);
  }

  addHandlerDeleteNoteButton(handler, element) {
    element
      .querySelector(`.btn--delete-note`)
      .addEventListener("click", handler.bind(element));
  }

  addHandlerClickNote(handler, element) {
    element.addEventListener(
      `click`,
      function (e) {
        if (
          !(
            [...e.target.classList].includes(`note`) ||
            [...e.target.classList].includes(`note--title`) ||
            [...e.target.classList].includes(`note--text-body`)
          )
        )
          return;
        handler.bind(element)();
      }.bind(element)
    );
  }

  addHandlersColorPickerNote(handler, element) {
    element.querySelector(`.color-picker`).addEventListener(
      `click`,
      function (e) {
        if (![...e.target.classList].includes(`color-picker--dot`)) return;
        this._changeNoteColor(e.target.dataset.color, element);
        handler.call(element);
      }.bind(this)
    );
  }

  _changeNoteColor(color, element) {
    element.dataset.color = color;
    // element.style.backgroundColor = `var(--note-color--${color}-solid)`;
  }

  _findNote(id) {
    return [...this._parentEl.querySelectorAll(`.note`)].find(
      (note) => Number(note.dataset.id) === id
    );
  }

  _generateNoteMarkup(id, title, text, color) {
    return `
      <div class="note" data-id="${id}" data-color="${color}">
        <div class="btn--delete-note"></div>
        <div class="note--content">
          <p class="note--title">${title}</p>
          <p class="note--text-body">${text}</p>
        </div>
        <div class="note--footer">
          <div class="color-picker">
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="yellow"
            ></div>
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="blue"
            ></div>
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="green"
            ></div>
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="red"
            ></div>
            <div
              class="color-picker--dot color-picker--dot--note btn"
              data-color="purple"
            ></div>
          </div>
        </div>
      </div>
    `;
  }

  _generateOverflowMarkup(color) {
    return `<div class="fade" data-color="${color}">...</div>`;
  }

  _checkTextOverflows(textContainerElement) {
    const totalElementHeight = pixelsToNumber(
      window.getComputedStyle(textContainerElement).height
    );
    // Determine height of the provided text
    const textHeight = computeScrollPosition(
      textContainerElement,
      textContainerElement.textContent.length
    );
    // If the provided text is longer that the viewable area of the container, the text is overflowing
    // console.log(
    //   `text overflows? ${textHeight} > ${totalElementHeight} = ${
    //     textHeight > totalElementHeight
    //   }`
    // );
    const textOverflows = textHeight > totalElementHeight;
    return textOverflows;
  }

  _adjustNoteForTextOverflow(note) {
    const textOverflows = this._checkTextOverflows(
      note.querySelector(`.note--text-body`)
    );

    const fadeElement = note.querySelector(`.fade`);
    if (textOverflows && !fadeElement) {
      note
        .querySelector(`.note--content`)
        .insertAdjacentHTML(
          `beforeend`,
          this._generateOverflowMarkup(note.dataset.color)
        );
    }

    if (!textOverflows) {
      note.querySelector(`.fade`)?.remove();
    }
  }
}

export default new NotesView();
