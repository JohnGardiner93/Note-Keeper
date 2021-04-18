class NotesView {
  _parentEl = document.querySelector(`.container--notes`);

  renderNote(id, title, text, color) {
    // If the note exists, update the note you already have
    console.log(`crafting a new note`);
    const markup = this._generateNoteMarkup(id, title, text, color);
    this._parentEl.insertAdjacentHTML(`beforeend`, markup);
    return this._parentEl.lastElementChild;
  }

  updateNoteContents(id, title, text, color) {
    const note = this._findNote(id);
    console.log(`I'm gonna update this note:`, note);

    note.querySelector(`.note--title`).textContent = title;
    note.querySelector(`.note--text-body`).textContent = text;
    note.dataset.color = color;
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
      .addEventListener('click', handler.bind(element));
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
      note => Number(note.dataset.id) === id
    );
  }

  _generateNoteMarkup(id, title, text, color) {
    return `
      <div class="note" data-id="${id}" data-color="${color}">
        <div class="btn--delete-note"></div>
        <div class="note--content">
          <p class="note--title">
            ${title}
          </p>
          <p class="note--text-body">
            ${text}
          </p>
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
}

// addHandlerNoteDisplay(handler) {}

export default new NotesView();

// const noteElements = notesContainerEl.querySelectorAll(`.note`);
