var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
const book = require('../controllers/book');


// GET book listing.
router.get('/', book.getBooks);


// GET book upload form.
router.get('/upload', ensureAuthenticated, book.getUploadForm);


// Upload book.
router.post('/upload', ensureAuthenticated, book.addBook);


// GET book search form.
router.get('/find', book.getBookSearchForm);


// GET a book.
router.get('/isbn', ensureAuthenticated, book.getBook);


// UPDATE(Modify) a book.
router.put('/', ensureAuthenticated, book.updateBook);


// DELETE(Remove) a book.
router.delete('/:bookIsbn', ensureAuthenticated, book.deleteBook);


module.exports = router;

