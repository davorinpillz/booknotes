// Import express
const express = require('express')

// Import books-controller
const booksRoutes = require('./books-controller.cjs')

// Create router
const router = express.Router()

// Add route for GET request to retrieve all book
// In server.js, books route is specified as '/books'
// this means that '/all' translates to '/books/all'
router.get('/all', booksRoutes.booksAll)
router.get('/:isbn/notes', booksRoutes.bookNotes)
router.get('/:isbn/bookcomments', booksRoutes.bookComments)
router.get('/:noteId/notecomments', booksRoutes.noteComments)
router.get('/:isbn/noterefs', booksRoutes.noteRefs)
router.get('/noteref', booksRoutes.noteRef)
router.get('/singleref', booksRoutes.singleNoteRef)
router.get('/', booksRoutes.test)

// Add route for POST request to create new book
// In server.js, books route is specified as '/books'
// this means that '/create' translates to '/books/create'
router.post('/create', booksRoutes.booksCreate)
router.post('/:isbn/addnote', booksRoutes.notesCreate)
router.post('/addcomment', booksRoutes.commentsCreate)
router.post('/crossreference', booksRoutes.crossReferenceCreate)

// Add route for PUT request to delete specific book
// In server.js, books route is specified as '/books'
// this means that '/delete' translates to '/books/delete'
router.put('/delete', booksRoutes.booksDelete)
router.put('/addtitle', booksRoutes.noteTitleUpdate)
router.put('/addpagenumber', booksRoutes.pageNumberUpdate)

// Export router
module.exports = router