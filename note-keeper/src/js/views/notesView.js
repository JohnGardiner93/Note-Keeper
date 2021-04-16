class NotesView {
  _parentEl = document.querySelector(`.container--notes`);

  renderNote(id, title, text, color) {
    // If the note exists, update the note you already have
    const note = this._findNote(id);
    const markup = this._generateNoteMarkup(id, title, text, color);
    console.log(`I'm gonna render this note:`, note);

    if (note !== undefined) {
      note.querySelector(`.note--title`).textContent = title;
      note.querySelector(`.note--text-body`).textContent = title;
      return note;
    } else {
      this._parentEl.insertAdjacentHTML(`beforeend`, markup);
      return this._parentEl.lastElementChild;
    }
  }

  removeNote(element) {
    element.remove();
    // console.log(element);
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
        if (![...e.target.classList].includes(`note`)) return;
        handler.bind(element)();
      }.bind(element)
    );
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
