class NotesView {
  _parentEl = document.querySelector(`.container--notes`);

  renderNote(id, title, text, color) {
    this._parentEl.insertAdjacentHTML(
      `beforeend`,
      this._generateNoteMarkup(id, title, text, color)
    );
    return this._parentEl.lastElementChild;
  }

  addHandlerDeleteNoteButton(handler, element) {
    element
      .querySelector(`.btn--delete-note`)
      .addEventListener('click', handler.bind(element));
  }

  removeNote(element) {
    element.remove();
    // console.log(element);
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
