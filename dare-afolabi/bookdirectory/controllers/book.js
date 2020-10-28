const Book = require("../models/Book");
const User = require('../models/User');

var multiparty = require('multiparty');


module.exports.getBooks = function (req, res) {
  // var bookList = readDirectorySync();
  // return bookList;

  Book.find({}, (error, result) => {
    if (error) {
      console.error(error);
      return null;
    }
    if (result != null) {
      // res.json(result);
      res.render("book-dashboard", { books: result });
    } else {
      res.json({});
    }
  });
};


module.exports.getUploadForm = function (req, res) {
  let { email } = req.body;
  var authName = null;

  User.find({}, (error, result) => {
    if (error) {
      console.error(error);
      return null;
    }
    if (result != null) {
      result.forEach(function (user) {
        if (user.email == email) {
          authName = user.name;
        }
      });
      res.render("upload-book", { users: result, name: authName });
    } else {
      res.json({});
    }
  });

  // res.render('upload-book');
};


module.exports.addBook = function(req, res) {
  console.log(req.body);

  const form = new multiparty.Form({ uploadDir: './uploads/' });
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(500).send({ error: err.message });


    console.log(fields);
    console.log(files);

    let isbn = fields.isbn[0];
    let title = fields.title[0];
    let category = fields.category[0];
    let author = fields.author[0];
    let publisher = fields.publisher[0];
    let pages = fields.pages[0];
    let year = fields.year[0];
    let filename = fields.filename[0];

    console.log(files.file);


    if(!isbn || !title || !category || !author || !publisher || !pages || !year){
      res.end('All fields are compulsory');
    } else {
      let newBook = new Book({
        isbn,
        title,
        category,
        author,
        publisher,
        pages,
        year
      });


      // Save Book
      newBook.save()
        .then((result) => console.log(result))
          .catch(error => console.log(error));
      
      
    }
    
  });

  res.redirect('/book');            
};


module.exports.getBook = function(req, res) {
  Book.findOne({isbn: req.query.isbn}, function(error, result) {
    if (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return;
    } else {
        if (!result) {
          if (res != null) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          }
          return;
        }
        if (res != null) {
          res.setHeader('Content-Type', 'application/json');
          res.send(result);
        }
          console.log(result);
      }
    });
};


module.exports.getBookSearchForm = function(req, res) {
  res.render('find-book');
};


module.exports.updateBook = function(req, res) {
  const { isbn, title, category, author, publisher, pages, year } = req.body;

  if(!isbn || !title || !category || !author || !publisher || !pages || !year){
    res.end('All fields are compulsory');
  } else {
    var newBook = new Book({
      isbn,
      title,
      category,
      author,
      publisher,
      pages,
      year
    });
  }


  Book.findOne({isbn: req.body.isbn}, function(error, result) {
    if (error) {
      console.error(error);
      
      res.send(error);
    } else {
        if (!result) {
          console.log('Item does not exist. Creating a new one');
          newBook.save()
            .then(book => {
              res.json({"addedBook": book});
            })
            .catch(err => console.log(err));
        } else {
          console.log('Updating existing item');
          result.isbn = newBook.isbn;
          result.title = newBook.title;
          result.category = newBook.category;
          result.author = newBook.author;
          result.publisher = newBook.publisher;
          result.pages = newBook.pages;
          result.year = newBook.year;

          Book.findOneAndUpdate({ isbn: req.body.isbn }, result, { new: true, useFindAndModify: false }, function(err, result) {
            if (err) {
              res.send(err);
            } else {
              res.json(result);
            }
          });

        }
      }
    });
};


module.exports.deleteBook = function(req, res) {
  Book.deleteOne({ isbn: req.params.bookIsbn }, function(err, result) {
    if (err) {
      res.send(err);
    } else if (result.ok === 1 && result.deletedCount === 1) {
      console.log(result);
      res.send('Successful deletion');
    } else {
      console.log(result);
      res.send('Unsuccessful deletion');
    }
  });
};

