/* global $ store api*/
'use strict';

const noteful = (function () {

  function render() {

    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);

    const editForm = $('.js-note-edit-form');
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
      <button class="removeBtn js-note-delete-button">X</button>
    </li>`);
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item).closest('.js-note-element').data('id');
    return id;
  }

  function handleNewNoteFormSubmit() {
    $('.js-start-new-note-form').on('submit', function (event) {
      event.preventDefault();
      store.currentNote = false;
      render();
    });
  }


  /**
   * EVENT LISTENERS AND HANDLERS
   */
  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId)
        .then(response => {
          store.currentNote = response;
          render();
        });

    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();

      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm = searchTerm ? { searchTerm } : {};

      api.search(store.currentSearchTerm)
        .then(response => {
          store.notes = response;
          render();
        });
    });
  }

  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', function (event) {
      event.preventDefault();

      const editForm = $(event.currentTarget);

      const noteObj = {
        id: store.currentNote.id,
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };

      if (store.currentNote.id) {

        const update = api.update(store.currentNote.id, noteObj).catch(err => err);
        const search = api.search(store.currentSearchTerm).catch(err => err);

        Promise.all([update, search])
          .then(updateResponse => {
            console.log(updateResponse);
            store.currentNote = updateResponse[0];
            store.notes = updateResponse[1];
            render();
          })
          .catch(err => console.log(err));

      }
      else {

        const create = api.create(noteObj).catch(err => err);

        Promise.all([create])
          .then(updateResponse => {
            store.currentNote = updateResponse;
            store.notes.push(updateResponse[0]);
            render();
          })
          .catch(err => console.log(err));
      }

    });
  }

  function handleDeleteItemClick() {
    $('.js-notes-list').on('click', '.js-note-delete-button', function () {
      const id = $(this).parent().attr('data-id');

      api.delete(id)
        .then(() => {
          return api.search(store.currentSearchTerm);
        })
        .then(res => {
          store.notes = res;
          render();
        });
      // api.delete(id)
      //   .then(() => {
      //     return api.search(store.currentSearchTerm);
      //   })
      //   .then(res => {
      //     store.notes = res;
      //     render();
      //   });
    });
  }


  function bindEventListeners() {
    handleNoteItemClick();
    handleDeleteItemClick();
    handleNoteSearchSubmit();

    handleNoteFormSubmit();
    handleNewNoteFormSubmit();

  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };

}());
