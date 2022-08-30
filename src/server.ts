import express, { Express } from 'express';
import path from 'path';
import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import { User } from './types/user';
import initPassport from './passport-config';
import { SalesFactory, Sales } from './model/sales';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

// DB
const LIMIT = '10';
const PAGE = '1';
const devDbUrl = process.env.MONGO_URL;
const url = process.env.MONGODB_URI || devDbUrl || '';
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log('Connected to DB.');
  })
  .catch((error) => {
    console.error('DB Error: ', error);
  });
// end DB

const users: User[] = [];
initPassport(
  passport,
  (email: string): User | undefined => {
    const filteredUser = users.find((user) => user.email === email);
    return filteredUser;
  },
  (id: string) => {
    const filteredUser = users.find((user) => user.id === id);
    return filteredUser;
  }
);

const app: Express = express();
//  temp
const pass = (req: any, res: any, next: any): void => next();

const checkAuth = (req: any, res: any, next: any): void => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
};

const checkNoAuth = (req: any, res: any, next: any): void => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return next();
};

app.set('views', path.join(__dirname, '/views'));
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static(__dirname));

app.get('/', (_, res) => {
  return res.redirect('/dashboard');
});

app.get('/dashboard', pass, (req, res) => {
  const { limit = LIMIT, page = PAGE } = req.query;

  Sales.find({}, (err, result) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('index.ejs', { sales: SalesFactory(result) });
    }
  })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
});

app.get('/login', checkNoAuth, (_, res) => {
  res.render('login.ejs');
});

app.get('/register', checkNoAuth, (_, res) => {
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

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

app.listen(3000);
