import {Router} from "express";
import ErrorRoutes from "./ErrorRoutes";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";
import authenticate from "../middleware/authenticate";


const router: Router = Router();

router.use("/errors", ErrorRoutes);
router.use("/auth", AuthRoutes);
router.use("/users", authenticate, UserRoutes);

export default router;