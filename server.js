'use strict ';

require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3020
const app = express();
const superagent = require('superagent');
const expressLayouts = require('express-ejs-layouts')

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


function notFound(req, res) {
    res.status(404).send('Page Not Found, I can\'t breath *.*');
}

function errorHandler(error, req, res) {
    res.status(500).send('Smth Wrong, I\'m dying -.-')
}

function homePage(req, res) {
    res.render('pages/index')
}

function searchForm(req, res) {
    res.render('pages/searches/news')
}

function findBook(req, res) {
    let url = `https://www.googleapis.com/books/v1/volumes?q=in${req.body.search}:${req.body.keyword}`
    return superagent.get(url).then(data => {
        let results = data.body.items.map(oneBook => {
            // console.log('aaaaaaaaaaaaaaaa', oneBok);
            return new Book(oneBook)
        })
        res.render('pages/searches/show', { books: results })

    }).catch(() => {
        res.render('pages/error')
    })
}

function Book(data) {
    this.title = data.volumeInfo.title;
    this.author = data.volumeInfo.authors || 'author name not available';
    this.isbn = data.volumeInfo.industryIdentifiers || 'isbn not available';
    this.image_url = data.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg'
    this.description = data.volumeInfo.description || 'Description not available';

}

app.get('/search', searchForm)
app.get('/', homePage);
app.get('*', notFound);
app.post('/searches', findBook)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Can u hear me? I'm PORT ${PORT} `);
})