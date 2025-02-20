// Import database
const knex = require('./db.cjs')
exports.test = async (req, res) => {

      // Send a error message in response
      res.json({ message: `Server works` })
}
// Retrieve all books
exports.booksAll = async (req, res) => {
  // Get all books from database
  knex
    .select('*') // select all records
    .from('books') // from 'books' table
    .then(userData => {
      // Send books extracted from database in response
      res.json(userData)
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error retrieving books: ${err}` })
    })
}

exports.bookNotes = async (req, res) => {
  //console.log(req.params.isbn)
  await knex
    .select('*')
    .from('notes')
    .where('book_id', req.params.isbn)
    .then(bookNotes => {
      
      res.json(bookNotes)
    })
    .catch(err => {
      res.json({message: `Failed to retrieve notes, ${err}`})
    })
}

exports.bookComments = async (req, res) => {
  console.log(req.body.note_id)
  await knex 
    .select('*')
    .from('comments')
    .where('note_id', req.params.noteId)
    .then(bookComments => {
      res.json(bookComments)
    })
    .catch(err => {
      res.json({message: `Failed to retrieve comments, ${err}`})
    })
}

// Create new book
exports.booksCreate = async (req, res) => {
  // Add new book to database
  knex('books')
    .insert({ // insert new record, a book
      'author': req.body.author,
      'title': req.body.title,
      'subtitle': req.body.subtitle,
      'category': req.body.category,
      'publishedDate': req.body.publishedDate,
      'isbn': req.body.isbn,
    })
    .then(() => {
      // Send a success message in response
      res.json({ message: `Book \'${req.body.title}\' by ${req.body.author} created.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating ${req.body.title} book: ${err}` })
    })
}
// Create new note
exports.notesCreate = async (req, res) => {
  // Add new book to database
  knex('notes')
    .insert({ // insert new record, a book
      'book_id': req.body.book_id,
      'note': req.body.note,
    })
    .then(() => {
      // Send a success message in response
      res.json({ message: `${req.body.note} for book \'${req.body.book_id}\' created.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating ${req.body.note} book: ${err}` })
    })
}

//create new comment
exports.commentsCreate = async (req, res) => {
  knex('comments')
    .insert({
      'note_id': req.body.noteId,
      'comment': req.body.comment,
      'time_created': req.body.time_created,
      'book_id': req.body.bookId,
    })
    .then(() => {
      // Send a success message in response
      res.json({ message: `${req.body.comment} for note \'${req.body.note_id}\' created.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating ${req.body.comment} book: ${err}` })
    })
}

//create new reference
exports.crossReferenceCreate = async (req, res) => {
  console.log(req.body)
  knex('cross_references')
    .insert({
      'first_note_id': req.body.first_note_id,
      'first_book_id': req.body.first_book_id,
      'first_book_chapter': req.body.first_book_chapter,
      'first_book_page_number': req.body.first_book_page_number,
      'second_note_id': req.body.second_note_id,
      'second_book_id': req.body.second_book_id,
      'second_book_chapter': req.body.second_book_chapter,
      'second_book_page_number': req.body.second_book_page_number,
      'comment': req.body.comment,
      'time_created': req.body.time_created,
    })
    .then(() => {
      // Send a success message in response
      res.json({ message: `${req.body.comment} for note \'${req.body.note_id}\' created.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating ${req.body.comment} book: ${err}` })
    })
}

//update note
exports.noteTitleUpdate = async (req, res) => {
  console.log(req.body.title, req.body.noteId)
  knex('notes')
    .update({chapter_title: req.body.title})
    .where('note_id', req.body.noteId)
    .then(bookNotes => {
      
      res.json(bookNotes)
    })
    .catch(err => {
      res.json({message: `Failed to update note, ${err}`})
    })
}

exports.pageNumberUpdate = async (req, res) => {
  console.log(req.body.pageNumber, req.body.noteId)
  knex('notes')
    .update({page_number: req.body.pageNumber})
    .where('note_id', req.body.noteId)
    .then(bookNotes => {
      res.json(bookNotes)
    })
    .catch(err => {
      res.json({message: `Failed to update note, ${err}`})
    })
}

//Add new comment 




// Remove specific book
exports.booksDelete = async (req, res) => {
  // Find specific book in the database and remove it
  knex('books')
    .where('id', req.body.id) // find correct record based on id
    .del() // delete the record
    .then(() => {
      // Send a success message in response
      res.json({ message: `Book ${req.body.id} deleted.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error deleting ${req.body.id} book: ${err}` })
    })
}

/* Remove all books on the list
exports.booksReset = async (req, res) => {
  // Remove all books from database
  knex
    .select('*') // select all records
    .from('books') // from 'books' table
    .truncate() // remove the selection
    .then(() => {
      // Send a success message in response
      res.json({ message: 'Book list cleared.' })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error resetting book list: ${err}.` })
    })
} */