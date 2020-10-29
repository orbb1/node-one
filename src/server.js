const express = require('express')
const app = express()
const path = require('path')

app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.listen(3000)