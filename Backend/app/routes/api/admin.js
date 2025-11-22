import { Router } from 'express';
import * as properties from '../../controllers/Propertiescontroller.js';
import * as user from '../../controllers/User.controller.js';
import checkauth from "../../middleware/Checkauth.js"
import { propertyUpload, blogUpload } from "../../middleware/upload.js";
import { createBlog, getAllBlogs, deleteBlog } from '../../Controllers/blogController.js';


const router = Router();

router.put("/properties/:id", checkauth, properties.editProperty);
router.delete("/properties/:id", checkauth, properties.deleteProperty);
router.get("/count", checkauth, properties.getcount);
router.post("/properties", checkauth, propertyUpload.array("images", 5), properties.addProperties);
router.get("/users", checkauth, user.getuser);
router.get('/blog', getAllBlogs);
router.post('/blog', checkauth, blogUpload.single('image'), createBlog);
router.delete('/blog/:id', checkauth, deleteBlog);

export default router;