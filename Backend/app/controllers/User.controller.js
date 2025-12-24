import mongoose from "mongoose";
// import { PropertiesCreationSchema } from "../schima/Properties.js";
import { role, status } from "../constants/index.js";
import * as UserServices from "../services/user.js";
import { sendContactInquiry } from "../libs/communication.js";


export const AddUsersAndSendMessage = async (req, res, next) => {
  try {
    const { FullName, Email, Phone_number, Subject } = req.body;
    if (!FullName || !Email || !Phone_number || !Subject) {
      return res.status(404).json({
        message: "All fields are required",
      });
    }
    const creationObj = {
      id: new mongoose.Types.ObjectId(),
      name: FullName,
      email: Email,
      phoneNumber: Phone_number,
      subject: Subject,
      role: role.users,
    };

    const userInquiry = await UserServices.save(creationObj);

    sendContactInquiry(creationObj);

    return res.status(201).json({
      message: "Message sent successfully",
      inquiry: userInquiry,
    });

  } catch (error) {
    console.error("POST /api/properties error:", error);
    next(error);
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedUser = await UserServices.deleteOne(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error);
    next(error);
  }
}


export const getuser = async (req, res, next) => {
  try {
    const inquiries = await UserServices.find({ role: { $ne: 1 } }, { password: 0 });

    const formattedInquiries = inquiries.map(inquiry => ({
      id: inquiry._id,
      name: inquiry.name,
      email: inquiry.email,
      phone_number: inquiry.phoneNumber,
      subject: inquiry.subject,
      message: inquiry.Message,
      created_at: inquiry.createdAt,
    }));

    return res.status(200).json(formattedInquiries);
  } catch (error) {
    console.error("GET /api/users error:", error);
    next(error);
  }
};