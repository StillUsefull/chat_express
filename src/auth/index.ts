import passport from 'passport';
import {LocalStrategy} from 'passport-local';
import {FacebookStrategy} from 'passport-facebook';
import User from '../data/entities/user/index';

const auth = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    });
    passport.deserializeUser(function(id, done) {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
    passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ username: new RegExp(username, 'i'), socialId: null }, function(err, user) {
            if (err) { return done(err); }
  
            if (!user) {
              return done(null, false, { message: 'Incorrect username or password.' });
            }
  
            user.validatePassword(password, (err, isMatch) => {
                  if (err) { return done(err); }
                  if (!isMatch){
                      return done(null, false, { message: 'Incorrect username or password.' });
                  }
                  return done(null, user);
            });
  
          });
        }
      ));
  
      var verifySocialAccount = (tokenA, tokenB, data, done) => {
          User.findOrCreate(data, function (err, user) {
                if (err) { return done(err); }
              return done(err, user); 
          });
      };
  
      passport.use(new FacebookStrategy(process.env.FACEBOOK, verifySocialAccount));
      
  
      return passport;
}

export default auth;