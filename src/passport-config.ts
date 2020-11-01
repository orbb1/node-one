import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';
import { User } from './types/user';

const initialize = (passport: PassportStatic, getUserByEmail: any, getUserById: any) => {
  const authenticator = async (email: string, password: string, done: any) => {
    const user: User | undefined = getUserByEmail(email) || {};
    if (user === null) {
      return done(null, false, { message: 'No user with that email' });
    }

    try {
      if ((user as User).password && await bcrypt.compare(password, (user as User).password)) {
        return done(null, user);
      }
      return done(null, false, { message: 'Password incorrect' });
    } catch (e) {
      return done(e);
    }
  };
  passport.use(new Strategy({ usernameField: 'email' }, authenticator));
  passport.serializeUser((user: User, done) => done(null, user.id));
  passport.deserializeUser((id: string, done) => {
    done(null, getUserById(id));
  });
};

export default initialize;
