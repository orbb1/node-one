const express = require('express')
const app = express()
const path = require('path')

app.set('views', path.join(__dirname, '/views'))

app.get('/', (req: any, res: any) => {
    res.render('index.ejs')
})

app.listen(3000)