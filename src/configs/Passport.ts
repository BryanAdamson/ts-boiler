import passport from "passport";
// import GoogleOauthTokenStrategy from "passport-google-oauth-token";
// import {googleClientId, googleClientSecret, jwtSecret} from "../utils/constants";
import User, {UserDocument} from "../models/User";
// import jwt from "jsonwebtoken";
// import {Request} from "express";


// const LocalStrategy = passportLocal.Strategy

// passport.use(
//     new GoogleOauthTokenStrategy(
//         {
//             clientID: googleClientId,
//             clientSecret: googleClientSecret,
//             passReqToCallback: true,
//         },
//         async (req: Request, accessToken: string, refreshToken: string, profile: any, done: (err?: string | Error | null, user?: any, info?: any) => void) => {
//             const user: UserDocument | null = await User.findOne({googleId: req.body.profileId});
//             console.log(accessToken);
//             console.log(profile);
//
//             if (!user) {
//                 done(new Error("unauthorized"), null);
//             } else {
//                 user.token = jwt.sign(
//                     {
//                         id: user.id,
//                         user_type: user.type,
//                     },
//                     jwtSecret,
//                     {
//                         expiresIn: '1000 days',
//                     }
//                 );
//
//                 console.log(user);
//                 done(null, user);
//             }
//         }
//     )
// );
//

// passport.use(
//     new LocalStrategy(
//         async (email: string, password: string, done: (err?: string | Error | null, user?: UserDocument | undefined, info?: any) => void) => {
//             const user: UserDocument | null = await User.findOne({email});
//             console.log(user)
//
//             if (!user) {
//                 return done(new Error("unauthorized"), undefined);
//             }
//
//             const passwordsMatch: boolean = bcrypt.compareSync(password as string, user.password as string);
//             if (!passwordsMatch) {
//                 return done(new Error("unauthorized"), undefined);
//             }
//
//             user.token = jwt.sign(
//                 {
//                     id: user.id,
//                     user_type: user.type,
//                 },
//                 jwtSecret,
//                 {
//                     expiresIn: '1000 days',
//                 }
//             );
//
//             console.log(user)
//             done(null, user);
//         }
//     )
// )
passport.serializeUser((user: Express.User, done) => {
    done(null, user);
});

passport.deserializeUser(async (user: Express.User, done) => {
    const current: UserDocument | null = await User.findById((user as UserDocument).id);
    done(null, current);
});