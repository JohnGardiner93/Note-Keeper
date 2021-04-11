class editNoteView {
  renderNoteEditor(id = -1) {
    const title = `Note Title`;
    const content = `Note Content`;

    noteEditorNoteTitleEl.textContent = title;
    noteEditorNoteTextEl.textContent = content;

    noteEditorWindowEl.style.display = `block`;
  }

  closeNoteEditor() {
    noteEditorWindowEl.style.display = `none`;
  }
}
