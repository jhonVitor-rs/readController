const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const app = express()

const hbs = exphbs.create({
  partialsDir: ['views/partials']
})

app.use(
  express.urlencoded({
    extended: true
  })
)

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(express.json())

app.get('/:book?', async (req, res) => {
  const book = await req.params.book
  let sql
  if(book){
    sql = `SELECT * FROM books WHERE name LIKE "%${book}%"`
  }else{
    sql = `SELECT * FROM books;`
  }

  await conn.query(sql, function(err, data){
    if(err){
      console.log(err)
      return
    }

    const books = data
    res.render('home', {books})
  })
})

app.post('/find', (req, res) => {
  const book = req.body.findBook

  res.redirect(`/${book}`)
})

app.get('/edit/:bookId', async (req, res) => {
  const id = req.params.bookId
  const sql = `SELECT * FROM books WHERE id = ${id};`

  await conn.query(sql, function(err, data){
    if(err){
      console.log(err)
      return
    }

    const book = data[0]
    res.render('edit', {book})
  })
})

app.post('/update/:bookId', async (req, res) => {
  const id = req.params.bookId
  const name = req.body.title
  const pages = req.body.pagesQtd

  const sql = `UPDATE books SET name = '${name}', pages = '${pages}' WHERE id = ${id};`
  await conn.query(sql, function(err, data){
    if(err){
      console.log(err)
      return
    }

    res.redirect('/')
  })
})

app.post('/books/insertbook', (req, res) => {
  const title = req.body.title
  const pagesQtd = req.body.pagesQtd

  const sql = `INSERT INTO books (name, pages) VALUES ('${title}', '${pagesQtd}');`

  try {
  conn.query(sql, async function(){
    res.redirect('/')
  })
  } catch (error) {
    console.log(error)
  }
})

app.get('/remove/:bookId', async (req, res) => {
  const id = req.params.bookId
  const sql = `DELETE FROM books WHERE id = ${id}`
  console.log(id)

  await conn.query(sql, function(err, data){
    if(err){
      console.log(err)
      return
    }

    res.redirect('/')
  })
})

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeJs'
})

try {
  conn.connect(function(){
    console.log('Conectou ao MySQL!!!')
    app.listen(3000, () => console.log('Servidor rodando'))
  })
} catch (error) {
  console.log(error)
}