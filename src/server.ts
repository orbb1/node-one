import express, { Express } from 'express';
import path from 'path';

const app: Express = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index.ejs', { name: 'World' });
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.listen(3000);
