import express, { Express } from 'express';
import path from 'path';
import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';
import { User } from './types/user';
import initPassport from './passport-config';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const users: User[] = [];
initPassport(passport, (email: string): User | undefined => {
  const filteredUser = users.find((user) => user.email === email);
  return filteredUser;
}, (id: string) => {
  const filteredUser = users.find((user) => user.id === id);
  return filteredUser;
});

const app: Express = express();

const checkAuth = (req:any, res:any, next:any): void => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
};

const checkNoAuth = (req:any, res:any, next:any): void => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return next();
};

app.set('views', path.join(__dirname, '/views'));
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static(__dirname));

app.get('/', checkAuth, (req, res) => {
  res.render('index.ejs', { name: 'World' });
});

app.get('/login', checkNoAuth, (req, res) => {
  res.render('login.ejs');
});

app.get('/register', checkNoAuth, (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
    });
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

app.listen(3000);
