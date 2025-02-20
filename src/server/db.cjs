const path = require('path')
const dbPath = path.resolve(__dirname, './db.sqlite')

// Create connection to SQLite database
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true
  })

  // Create a table in the database called "books"
knex.schema
// Make sure no "books" table exists
// before trying to create new
.hasTable('books')
  .then((exists) => {
    if (!exists) {
      // If no "books" table exists
      // create new, with "id", "author", "title",
      // "pubDate" and "rating" columns
      // and use "id" as a primary identification
      // and increment "id" with every new record (book)
      return knex.schema.createTable('books', (table)  => {
        table.increments('id').primary()
        table.string('title')
        table.string('subtitle')
        table.string('author')
        table.string('category')
        table.string('publishedDate')
        table.string('isbn')
      })
      .then(() => {
        // Log success message
        console.log('Table \'Books\' created')
      })
      .catch((error) => {
        console.error(`There was an error creating table: ${error}`)
      })
    }
  })
  .then(() => {
    // Log success message
    console.log('done')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })

knex.schema
  .hasTable('notes')
    .then((exists) => {
      if (!exists) {
        return knex.schema.createTable('notes', (table)  => {
          table.increments('id').primary()
          table.integer('book_id')
          table.foreign('book_id').references('Books.isbn_in_books')
          table.uuid('note_id').defaultTo(knex.fn.uuid())
          table.foreign('note_id').references('Notes.id_in_notes')
          table.string('chapter_title')
          table.string('note')
          table.string('page_number')
        })
        .then(() => {
          // Log success message
          console.log('Table \'Books\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
      }
    })
    .then(() => {
      // Log success message
      console.log('done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })

knex.schema
    .hasTable('comments')
      .then((exists) => {
        if (!exists) {
          return knex.schema.createTable('comments', (table) => {
            table.increments('id').primary()
            table.uuid('comment_id').defaultTo(knex.fn.uuid())
            table.string('note_id')
            table.foreign('note_id').references('Notes.note_id_in_notes')
            table.string('book_id')
            table.foreign('book_id').references('Books.isbn_in_books')
            table.string('comment')
            table.datetime('time_created')
            
          })
          .then(() => {
            console.log('Table \'Comments\' created')
          })
          .catch((error) => {
            console.error(`There was an error creating table: ${error}`)
          })
        }
      })
      .then(() => {
        // Log success message
        console.log('done')
      })
      .catch((error) => {
        console.error(`There was an error setting up the database: ${error}`)
      })

knex.schema
  .hasTable('cross_references')
    .then((exists) => {
      if (!exists) {
        return knex.schema.createTable('cross_references', (table) => {
          table.increments('id').primary()
          table.uuid('reference_id').defaultTo(knex.fn.uuid())

          table.string('first_note_id')
          table.foreign('first_note_id').references('Notes.note_id_in_notes')
          table.string('first_book_id')
          table.foreign('first_book_id').references('Books.isbn_in_books')

          table.string('first_book_chapter')
          table.foreign('first_book_chapter').references('Notes.chapter_title_in_notes')
          table.string('first_book_page_number')
          table.foreign('first_book_page_number').references('Notes.page_number_in_notes')

          table.string('second_note_id')
          table.foreign('second_note_id').references('Notes.note_id_in_notes')
          table.string('second_book_id')
          table.foreign('second_book_id').references('Books.isbn_in_books')

          table.string('second_book_chapter')
          table.foreign('second_book_chapter').references('Notes.chapter_title_in_notes')
          table.string('second_book_page_number')
          table.foreign('second_book_page_number').references('Notes.page_number_in_notes')

          table.string('comment')
          table.datetime('time_created')
          
        })
        .then(() => {
          console.log('Table \'Cross references\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
      }
    })
    .then(() => {
      // Log success message
      console.log('done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })
  

// Just for debugging purposes:
// Log all data in "books" table
knex.select('*').from('books')
.then(data => console.log('data:', data))
.catch(err => console.log(err))

// Export the database
module.exports = knex