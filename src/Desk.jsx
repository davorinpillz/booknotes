import './App.css'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { useImmer } from 'use-immer'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import axios from "axios"







//STORE
const useBookStore = create(
  combine({
    books: {},
    isbn: '',
    foundBook: {},
  }, (set) => {
    return {
      setBooks: (collection) => {
        set((state) => ({
          books: collection,
        }))
      },
      setIsbn: (newIsbn) => {
        set((state) => ({
          isbn: newIsbn
        }))
      },
      setFoundBook: (found) => {
        set((state) => ({
          foundBook: found
        }))
      }
    }
  })
)















//MAIN COMPONENT
export default function Desk() {
  const setBooks = useBookStore((state) => state.setBooks)
  const books = useBookStore((state) => state.books)
  const setIsbn = useBookStore((state) => state.setIsbn)
  const isbn = useBookStore((state) => state.isbn)
  const foundBook = useBookStore((state) => state.foundBook)
  const setFoundBook = useBookStore((state) => state.setFoundBook)


















  function getSearchBook() {
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyB3gJ000xrR9_kYY7Dv7I7Vk6uU7mkOdyE`).then(function(response) {
      setFoundBook(response.data.items[0].volumeInfo)
    })
    .catch(function (error) {
      console.log(error)
      window.alert("Book not found")
    })

  }
  

  function addToCollection() {
    axios.post('http://localhost:4001/create', {
      author: foundBook.authors[0],
      title: foundBook.title,
      isbn: foundBook.industryIdentifiers[1].identifier,
      category: foundBook.categories[0],
      publishedDate: foundBook.publishedDate,
      subtitle: foundBook.subtitle,
    })
    .then(function(response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })  
  }
  

  function getCollection() {
    axios.get('http://localhost:4001/all')
    .then(function(response) {
      console.log(response.data.flat())
      setBooks(response.data)
    })
    .catch(function(error) {
      console.log(error)
    })
  }
  
  console.log(books)








  function handleIsbnInput(event) {
    event.preventDefault()
    setIsbn(event.target.value)
  }
  function handleSearchClick() {
    document.getElementById('isbn-search').value=""
    getSearchBook()
  }
  function handleAddClick() {
    addToCollection()
    setFoundBook([])
  }
  function handleCancelClick() {
    setFoundBook([])
  }
  function handleViewCollection() {
    getCollection()
  }







  return (
    <> 
      <Box style={{
        display: 'flex',
        flexDirection: 'column',
        fontSize: 16,
        color: "Black",
      }}>
        <Box>
          {foundBook.title ? 
          <FoundBook book={foundBook} onAddClick={() => handleAddClick()} onCancelClick={() => handleCancelClick()}/>: <></>}
        </Box>
        <TextField 
        variant="standard"
          id="isbn-search"
          placeholder='Enter ISBN'
          onChange={handleIsbnInput}
          style={{
            backgroundColor: "a1a1a1",
          }}
        />
        <Button 
        variant="contained"
        style={{
          marginTop: ".5rem",
          padding: "10px"
        }}
        onClick={handleSearchClick}>Search ISBN</Button>
        <Button 
        variant="contained"
        style={{
          marginTop: ".5rem",
          padding: "10px"
        }}
        onClick={handleViewCollection}>View Collection</Button>
      </Box>
    </>
  )
}


































function displayCollection( {books, onSelectClick} ) {

  return (
    <Paper
      sx={{ height: '369px', width: '379x', bgcolor: 'background.paper', marginBottom: 2.5, fontSize: 10 }}
    > 
      <DataGrid
        onRowClick={handleRowClick}
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0, fontSize: 12}}
      />

    </Paper>
  )
}





































 //components
 function FoundBook({book, onAddClick, onCancelClick}) {
  return (
    <Box
    >
      <Paper elevation={3}
        style={{ padding: 12, marginBottom: 20,}}
        spacing={2}>
        <Typography variant="h6"
        >{book.title}</Typography>
        <Typography variant="subtitle2"
        >{book.subtitle}</Typography>
        <Typography variant="subtitle1"
        >{book.authors}</Typography>
             <Stack direction="row"
      style={{marginTop: 0, marginBottom: 0, justifyContent: 'center'}}
      >
        <Tooltip title="Add to collection" arrow>
          <LibraryAddIcon
            style={{backgroundColor: 'white', color: 'slategray', margin: '3px'}}
            onClick={onAddClick}
          >
          </LibraryAddIcon>
        </Tooltip>
        <Tooltip title="Cancel" arrow>
          <NotInterestedIcon
            style={{backgroundColor: 'white', color: 'slategray', margin: '3px'}}
            onClick={onCancelClick}
          />
      </Tooltip>
        </Stack>
      </Paper>
    </Box>
  )
}
