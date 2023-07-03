import paystack from "paystack";
import {paystackSecretKey} from "../utils/constants";

const Paystack: paystack.Object = paystack(paystackSecretKey as string);

export default Paystack;