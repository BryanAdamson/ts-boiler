import passport from "passport";
import User, {UserDocument} from "../models/User";

passport.serializeUser((user: Express.User, done) => {
    done(null, user);
});

passport.deserializeUser(async (user: Express.User, done) => {
    const current: UserDocument | null = await User.findById((user as UserDocument).id);
    done(null, current);
});