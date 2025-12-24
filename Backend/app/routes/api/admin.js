import { Router } from 'express';
import * as properties from '../../controllers/Propertiescontroller.js';
import * as user from '../../controllers/User.controller.js';
import * as gallery from '../../controllers/galleryController.js';
import { galleryUpload } from "../../middleware/upload.js";
import checkauth from "../../middleware/Checkauth.js"
import { propertyUpload, blogUpload } from "../../middleware/upload.js";
import { createBlog, getAllBlogs, deleteBlog, getBlogById, updateBlog } from '../../controllers/blogController.js';


const router = Router();

router.put("/properties/:id", checkauth, properties.editProperty);
router.delete("/properties/:id", checkauth, properties.deleteProperty);
router.get("/count", checkauth, properties.getcount);
router.post("/properties", checkauth, propertyUpload.array("images", 10), properties.addProperties);
router.get("/users", checkauth, user.getuser);
// Blog routes
router.get('/blog', getAllBlogs);
router.post('/blog', checkauth, blogUpload.single('image'), createBlog);
router.delete('/blog/:id', checkauth, deleteBlog);
router.get('/blog/:id', getBlogById);
router.put('/blog/:id', checkauth, updateBlog);
// Gallery routes
router.post('/gallery', checkauth, galleryUpload.single('image'), gallery.uploadGalleryImage);
router.get('/gallery', gallery.getAllGalleryImages); // public reading
router.delete('/gallery/:id', checkauth, gallery.deleteGalleryImage);
router.put('/gallery/:id', checkauth, gallery.updateGalleryImage);

router.delete("/users/:id", user.deleteUser);

export default router;