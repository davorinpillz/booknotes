import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CircularProgress from '@mui/material/CircularProgress';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkIcon from '@mui/icons-material/Link';
import Badge from '@mui/material/Badge';
import AddCommentIcon from '@mui/icons-material/AddComment';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import PinIcon from '@mui/icons-material/Pin';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import './Desk.css';
//BOOK STORE
const useBookStore = create(
  combine({
    books: {},
    isbn: '',
    foundBook: {},
    pickedBook: {},
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
      },
      setPickedBook: (book) => {
        set((state) => ({
          pickedBook: book
        }))
      }
    }
  })
)
//MAIN COMPONENT
export default function Desk() {
  //books state
  const setBooks = useBookStore((state) => state.setBooks)
  const books = useBookStore((state) => state.books)
  const setIsbn = useBookStore((state) => state.setIsbn)
  const isbn = useBookStore((state) => state.isbn)
  const foundBook = useBookStore((state) => state.foundBook)
  const setFoundBook = useBookStore((state) => state.setFoundBook)
  const pickedBook = useBookStore((state) => state.pickedBook)
  const setPickedBook = useBookStore((state) => state.setPickedBook)
  //book collection db functions
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
      setBooks(response.data)
    })
    .catch(function(error) {
      console.log(error)
    })
  }
  //local flags
  const [viewCollectionFlag, setViewCollectionFlag] = useState(false)
  const [bookSelectedFlag, setBookSelectedFlag] = useState(false)
  //event handlers
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
    setViewCollectionFlag(!viewCollectionFlag)
  }
  function handleBookSelectClick(params) {
    setBookSelectedFlag(!bookSelectedFlag)
    setPickedBook(params.row)
  }
  function handleReturnBookClick() {
    setBookSelectedFlag(!bookSelectedFlag)
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
          {viewCollectionFlag && !bookSelectedFlag ? 
          <DisplayCollection books={books} onSelectClick={(params) => handleBookSelectClick(params)}/>: bookSelectedFlag ? <SelectedBook book={pickedBook} onReturnClick={() => handleReturnBookClick()}/> : <></>}
        </Box>
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
          onClick={handleViewCollection}>View Collection
        </Button>
        <Box>
          {bookSelectedFlag ? <BookNotes book={pickedBook} /> : <></> }
        </Box>
      </Box>
    </>
  )
}
//COMPONENTS
          //book components
 function FoundBook({book, onAddClick, onCancelClick}) {
  return (
    <Box
    >
      <Paper elevation={3}
        style={{ padding: 12, marginBottom: 20,}}
        spacing={2}
      >
        <Typography variant="h6">{book.title}</Typography>
        <Typography variant="subtitle2">{book.subtitle}</Typography>
        <Typography variant="subtitle1">{book.authors}</Typography>
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
function DisplayCollection( {books, onSelectClick} ) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'author', headerName: 'Author', width: 150 },
  ];
  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <Paper
      sx={{ height: '369px', width: '379x', bgcolor: 'background.paper', marginBottom: 2.5, fontSize: 10 }}
    > 
      <DataGrid
        onRowClick={onSelectClick}
        rows={books}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0, fontSize: 12}}
      />
    </Paper>
  )
}
function SelectedBook ( {book, onReturnClick} ) {
  return (
    <Stack>
      <Paper 
        elevation={4}
        style={{ padding: 12, marginBottom: 20 }}
        spacing={2}
      >
        <Typography variant="h6">{book.title}</Typography>
        <Typography variant="subtitle2">{book.subtitle}</Typography>
        <Typography variant="subtitle1">{book.author}</Typography>
        <Typography variant="subtitle2">{book.publishedDate}</Typography>
        <Typography variant="subtitle2">{book.category}</Typography>
        <Typography variant="subtitle2">{book.isbn}</Typography>
        <Divider 
          style={{marginBottom: 5, color: "#fafaf7", marginTop: 10 }}
        />
        <Stack direction="row"
          style={{marginTop: 0, marginBottom: 0, justifyContent: 'center'}}
        >
        <IconButton color="primary" aria-label='primary' style={{ outline: 'none' }}>
          <Tooltip title="Back to collection" arrow>
            <KeyboardReturnIcon 
              style={{backgroundColor: 'white', color: 'gray', margin: '3px', marginTop: 10}}
              onClick={onReturnClick}
            />
          </Tooltip>
        </IconButton>
        </Stack>
      </Paper>
    </Stack>
  )
}
//NOTE STORE
const useNoteStore = create(
  combine({
    notes: {},
    note: '',
    chapterTitle: '',
    pageNumber: '',
    comments: {},
    comment: '',
    inputNote: '',
    reference: [],
    refs: {},
  }, (set) => {
    return {
      setNotes: (newNote) => {
        set((state) => ({
          notes: newNote
        }))
      }, 
      setNote: (newNote) => {
        set((state) => ({
          note: newNote
        }))
      },
      setChapterTitle: (newTitle) => {
        set((state) => ({
          chapterTitle: newTitle,
        }))
      },
      setPageNumber: (newPageNumber) => {
        set((state) => ({
          pageNumber: newPageNumber
        }))
      },
      setComments: (newComment) => {
        set((state) => ({
          comments: newComment
        }))
      },
      setComment: (newComment) => {
        set((state) => ({
          comment: newComment
        }))
      },  
      setInputNote: (newNote) => {
        set((state) => ({
          inputNote: newNote
        }))
      },
      setReference: (ref) => {
        set((state) => ({
          reference: [...state.reference, ref]
        }))
      },
      setRefs: (ref) => {
        set((state) => ({
          refs: ref
        }))
      }
    }
  }
)
)
//NOTE COMPONENTS
function BookNotes ( { book } ) {
  //notes state
  const setNotes = useNoteStore((state) => state.setNotes)
  const notes = useNoteStore((state) => state.notes)
  const setNote = useNoteStore((state) => state.setNote)
  const note = useNoteStore((state) => state.note)
  const setInputNote = useNoteStore((state) => state.setInputNote)
  const inputNote = useNoteStore((state) => state.inputNote)
  const setComment = useNoteStore((state) => state.setComment)
  const comment = useNoteStore((state) => state.comment)
  const setComments = useNoteStore((state) => state.setComments)
  const comments = useNoteStore((state) => state.comments)
  const setReference = useNoteStore((state) => state.setReference)
  const reference = useNoteStore((state) => state.reference)
  const setRefs = useNoteStore((state) => state.setRefs)
  const refs = useNoteStore((state) => state.refs)
  //local state
  const [title, setTitle] = useState('')
  const [pageNumber, setPageNumber] = useState('')
  const [reloadFlag, setReloadFlag] = useState('')
  //note db functions
  function addNoteToBook() {
    axios.post(`http://localhost:4001/:${book.isbn}/addnote`, {
      book_id: book.isbn,
      note: inputNote,
    })
    .then(function(response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
    .finally(getNotesForBook)  
  }
  function addChapterTitle(n) {
    axios.put(`http://localhost:4001/addtitle`, {
      title: title,
      noteId: n.note_id,
    })
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    })
    .finally(setNote(''))
  }
  function addPageNumber(n) {
    axios.put(`http://localhost:4001/addpagenumber`, {
      pageNumber: pageNumber,
      noteId: n.note_id,
    })
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    })
    .finally(setNote(''))
  }
  function addComment(n) {
    axios.post(`http://localhost:4001/addcomment`, {
      comment: comment,
      noteId: n.note_id,
      bookId: n.book_id,
      time_created: new Date().toLocaleString(),
    })
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    })
    .finally(setComment(''))
  }
  function addCrossReference() {
    if (reference.length == 2) {
      axios.post(`http://localhost:4001/crossreference`, {
        first_note_id: reference[0][0],
        first_book_id: reference[0][1],
        first_book_chapter: reference[0][2],
        first_book_page_number: reference[0][3],
        second_note_id: reference[1][0],
        second_book_id: reference[1][1],
        second_book_chapter: reference[1][2],
        second_book_page_number: reference[1][3],
        time_created: new Date().toLocaleString(),
      })
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error)
      })
      .finally(setReference([]))
    }
    else console.log("not ready")
  }
  function getNotesForBook() {
    axios.get(`http://localhost:4001/${book.isbn}/notes`)
    .then(function(response) {
      setNotes(response.data)
    })
    .catch(function(error) {
      console.log(error)
    })
  }
  function getCommentsForBook() {
    axios.get(`http://localhost:4001/${book.isbn}/bookcomments`)
    .then(function(response) {
      setComments(response.data)
    })
    .catch(function(error) {
      console.log(error)
    })
  }
  function getNoteReferencesForBook() {
    axios.get(`http://localhost:4001/${book.isbn}/noterefs`)
    .then(function(response) {
      setRefs(response.data)
    })
    .catch(function(error) {
      console.log(error)
    })
  }
  //event handlers
  useEffect(() => {
    getNotesForBook()
    getCommentsForBook()
    addCrossReference()
    getNoteReferencesForBook()
  }, [reloadFlag, reference])
  function handleNoteInput(event) {
    event.preventDefault()
    setInputNote(event.target.value)
  }
  function handleAddNoteClick() {
    document.getElementById('note').value=""
    addNoteToBook()
  }
  //nested component (note => chapter, page, comment) event handlers
    function handleAddChapterClick(note) {
      setNote(note)
      addChapterTitle(note)
    }
    function handleAddPageNumberClick(note) {
      setNote(note)
      addPageNumber(note)
    }
    function handleAddCommentClick(note) {
      setNote(note)
      addComment(note)
    }
  return (
    <Stack 
      spacing={2}
      style={{width: "100%"}}
    >
      <Paper 
            elevation={4}
            style={{ 
              padding: 12,
              marginTop: "10px",
            }}
            spacing={2}
            //key={index}
      >
        <Stack >  
          <Stack 
            spacing={2}
            style={{maxWidth: 'auto'}}
          >
            <TextField
              id="note"
              label="Enter Note"
              multiline
              rows={4}
              defaultValue=""
              onChange={handleNoteInput}
            />
            <Button
              style={{
              }}
              variant="contained" 
              onClick={handleAddNoteClick}
            >
              add note
            </Button>
          </Stack>  
        </Stack>
      </Paper>
      {notes.length > 0 ? 
      notes.map((note, index) => {
        return(
          <Note 
            book={book}
            note={note}
            getNotesForBook={getNotesForBook}
            getCommentsForBook={getCommentsForBook}
            onAddChapterClick={() => handleAddChapterClick(note)}
            onAddPageNumberClick={() => handleAddPageNumberClick(note)}
            onAddCommentClick={() => handleAddCommentClick(note)}
            setTitle={setTitle}
            setPageNumber={setPageNumber}
            setComment={setComment}
            comments={comments}
            setReloadFlag={setReloadFlag}
            setReference={setReference}
            refs={refs}
             />
        )
      }) : <></>}
    </Stack>
  )
}
function Note ( { 
      book,
      note, 
      onAddChapterClick, 
      setTitle, 
      onAddPageNumberClick, 
      setPageNumber, 
      onAddCommentClick, 
      setComment, 
      comments, 
      setReloadFlag,
      setReference,
      refs
    } ) {
  //local flags
  const [chapterIconClick, setChapterIconClick] = useState(false)
  const [pageIconClick, setPageIconClick] = useState(false)
  const [commentIconClick, setCommentIconClick] = useState(false)
  const [AddLinkIconClick, setAddLinkIconClick] = useState(false)
  const [expandIconClick, setExpandIconClick] = useState(false)

  if (refs.length == 0) {
    return (
      <Box style={{ marginTop: "100px" }}>
        <CircularProgress />
      </Box>
    )
  }
  else if (refs.length > 0){
  return (
    <Box >
      <Paper
      elevation={4}
      style={{ 
        padding: 12,
        marginTop: "10px",
      }}
      spacing={2}
      >
      <Box >
        {chapterIconClick ? <AddChapter 
          onAddChapterClick={onAddChapterClick}
          setTitle={setTitle}
          setChapterIconClick={setChapterIconClick}
          setReloadFlag={setReloadFlag}
          /> : <></>}
        <Box>
          <Typography 
            style={{fontWeight: 'bold', fontSize: 14, marginBottom: '10px'}}
          >{note.chapter_title}</Typography>
        </Box>
        <Box>
          <Typography 
            style={{fontStyle: 'oblique', fontSize: 18}}
          >{note.note}</Typography>
        </Box> 
        <Box >
        {pageIconClick ? <AddPageNumber 
          onAddPageNumberClick={onAddPageNumberClick}
          setPageNumber={setPageNumber}
          setPageIconClick={setPageIconClick}
          setReloadFlag={setReloadFlag}
          /> : <></>}
        </ Box> 
        <Box style={{marginBottom: '6px'}}>
          <Typography 
            style={{fontStyle: 'normal', fontSize: 12, color: 'gray', marginTop: '10px', marginBottom: '10px'}}
          >{note.page_number}</Typography>
        </Box>
      </Box>
      <Divider style={{marginBottom: '10px'}}/>
      {expandIconClick ? 
        <Box>{comments.filter((comment) => comment.note_id === note.note_id).map(filteredComment => (
          <Box>
          <Typography style={{ fontSize: 10, marginBottom: '5px', marginTop: '10px', color: 'gray' }}>
            {filteredComment.time_created}
          </Typography>
          <Typography style={{ marginBottom: '10px' }}>
            {filteredComment.comment}
          </Typography>
          <Divider />
          </Box>))}
        </Box> : <></>}
        <Box >
          {commentIconClick ? <AddComment 
            onAddCommentClick={onAddCommentClick}
            setComment={setComment}
            setCommentIconClick={setCommentIconClick}
            comments={comments}
            setReloadFlag={setReloadFlag}
            /> : <></>}
        </ Box> 
        <Box style={{marginBottom: '6px'}}>
          <Typography 
            style={{fontStyle: 'normal', fontSize: 10, color: 'gray'}}
          ></Typography>
        </Box>
      <Stack 
          direction="row"
          style={{marginTop: 10, marginBottom: 0, justifyContent: 'center'}}
      >
        <IconButton color="primary" aria-label='primary' style={{ outline: 'none' }}>
          <Tooltip title="Add chapter title" arrow>
            <AutoStoriesIcon 
              style={{backgroundColor: 'white', color: 'gray', margin: '3px'}}
              onClick={() => {setChapterIconClick(!chapterIconClick)}}
            />
          </Tooltip>
        </IconButton>
        <IconButton color="primary" aria-label='primary' style={{ outline: 'none' }}>
          <Tooltip title="Add page number" arrow>
            <PinIcon
              style={{backgroundColor: 'white', color: 'gray', margin: '3px'}}
              onClick={() => {setPageIconClick(!pageIconClick)}}
            />
          </Tooltip>
        </IconButton>
        <IconButton color="primary" aria-label='primary' style={{ outline: 'none' }}>
          <Tooltip title="Add comment" arrow>
            <AddCommentIcon
              id="comment"
              style={{backgroundColor: 'white', color: 'gray', margin: '3px'}}
              onClick={() => {setCommentIconClick(!commentIconClick)}}
            />
          </Tooltip>
        </IconButton>
        <Box>
          {!expandIconClick ?  
        <IconButton color="primary" aria-label='primary' style={{ outline: 'none' }}>
          <Badge color="primary" badgeContent={comments.filter((c) => c.note_id === note.note_id).length}>
          <Tooltip title="Show comments" arrow>
            <UnfoldMoreIcon
              id="expand"
              style={{backgroundColor: 'white', color: 'gray', margin: '3px'}}
              onClick={() => {setExpandIconClick(!expandIconClick)}}
            />
          </Tooltip>
          </Badge>
        </IconButton> : 
        <IconButton color="primary" aria-label='primary' style={{ outline: 'none' }}>
          <Tooltip title="Collapse comments" arrow>
          <UnfoldLessIcon
            id="collapse"
            style={{backgroundColor: 'white', color: 'gray', margin: '3px'}}
            onClick={() => {setExpandIconClick(!expandIconClick)}}
          />
          </Tooltip>
        </IconButton>}
        </Box>
        <IconButton color="primary" aria-label='primary' style={{ outline: 'none' }}>
          <Tooltip title="Link note" arrow>
            <AddLinkIcon
            id="Link note"
            style={{backgroundColor: 'white', color: 'gray'}}
            onClick={() => 
              {
                setAddLinkIconClick(!AddLinkIconClick); 
                setReference([note.note_id, book.isbn, note.chapter_title, note.page_number])
              }}
          />
          </Tooltip>
        </IconButton>        
        <IconButton style={{ outline: 'none' }}>
          <Badge color="primary" badgeContent={refs.filter((ref) => ref.first_note_id === note.note_id || ref.second_note_id === note.note_id).length}>
          <Tooltip title="View referenced notes" arrow>
            <LinkIcon
              id="Refs"
              style={{backgroundColor: 'white', color: 'gray'}}
              onClick={() => console.log(refs)}
              />
          </Tooltip>
          </Badge>
        </IconButton>
      </Stack>
      <Stack>
        <Box>
          <p>place holder reference content</p>
        </Box>        
      </Stack>
      </Paper>
    </Box>
  )}
}
function AddChapter ( { onAddChapterClick, setTitle, setChapterIconClick, setReloadFlag } ) {
  function handleTitleInput(event) {
    event.preventDefault()
    setTitle(event.target.value)
  }
  return (
    <>
      <Stack spacing={2}>
        <TextField
            style={{fontStyle: 'Normal', marginTop: 13, marginBottom: 0}}
          id="chaptertitle-input"
          label="Enter Chapter Title"
          type="search"
          rows={4}
          defaultValue=""
          onChange={handleTitleInput}
        />
        <Button
          style={{ marginBottom: 10 }}
          variant="contained" 
          onClick={() => {onAddChapterClick(); setChapterIconClick(); setReloadFlag(Math.random())}}>
            add chapter title
        </Button>
      </Stack>
    </>
  )
}
function AddPageNumber ( { onAddPageNumberClick, setPageNumber, setPageIconClick, setReloadFlag } ) {
  function handlePageInput(event) {
    event.preventDefault()
    setPageNumber(event.target.value)
  }
  return (
    <>
      <Stack spacing={2}>
        <TextField
            style={{fontStyle: 'Normal', marginTop: 13, marginBottom: 0}}
          id="pagenumber-input"
          label="Enter Page Number"
          type="search"
          rows={4}
          defaultValue=""
          onChange={handlePageInput}
        />
        <Button
          style={{ marginBottom: 10 }}
          variant="contained" 
          onClick={() => {onAddPageNumberClick(); setPageIconClick(); setReloadFlag(Math.random())}}>
            add page number
        </Button>
      </Stack>
    </>
  )
}
function AddComment ( { onAddCommentClick, setComment, setCommentIconClick, setReloadFlag } ) {
  function handleCommentInput(event) {
    event.preventDefault()
    setComment(event.target.value)
  }
  return (
    <>
      <Stack spacing={2}>
        <TextField
            style={{fontStyle: 'Normal', marginTop: 13, marginBottom: 0}}
          id="comment-input"
          label="Enter Comment"
          type="search"
          multiline
          rows={4}
          defaultValue=""
          onChange={handleCommentInput}
        />
        <Button
          style={{ marginBottom: 10 }}
          variant="contained" 
          onClick={() => {onAddCommentClick(); setCommentIconClick(); setReloadFlag(Math.random())}}>
            add comment
        </Button>
      </Stack>
    </>
  )
}