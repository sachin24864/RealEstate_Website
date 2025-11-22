import mongoose from "mongoose";
// import { PropertiesCreationSchema } from "../schima/Properties.js";
import { role, status } from "../constants/index.js";
import * as UserServices from "../services/user.js";
import { sendContactInquiry } from "../libs/communication.js";


export const AddUsersAndSendMessage = async (req, res, next) => {
  try {
    const { FullName, Email, Phone_number, Subject, messsage } = req.body;
    if (!FullName || !Email || !Phone_number || !Subject || !messsage) {
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
      Message: messsage,
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