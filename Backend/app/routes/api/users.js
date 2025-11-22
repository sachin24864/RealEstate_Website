import express from "express";
import {
  addProperties,
  getAllProperties,
  deleteProperty,
  editProperty,
  getcount,
  // getPropertiesByTypeAndStatus,
  getPic,
  getPropertyById
} from "../../controllers/Propertiescontroller.js";
import {AddUsersAndSendMessage} from "../../controllers/User.controller.js"


const router = express.Router();

router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById);
router.post("/contact", AddUsersAndSendMessage)

router.get("/pic", getPic);

export default router;
