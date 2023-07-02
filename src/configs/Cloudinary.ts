import cloudinary from "cloudinary";
import {cloudinaryApiKey, cloudinaryApiSecret, cloudinaryCloudName} from "../utils/constants";

cloudinary.v2.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret
})

export default cloudinary;