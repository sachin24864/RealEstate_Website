import mongoose from "mongoose";
// import { PropertiesCreationSchema } from "../schima/Properties.js";
import { status, role } from "../constants/index.js";
import * as PropertiesServices from "../services/Properties.js";
import * as UserServices from "../services/user.js";


// =============================
// Add Property with Images
// =============================
export const addProperties = async (req, res, next) => {
  try {

    const { title, description, location, price, property_type, bedrooms, bathrooms, area_sqft, status } = req.body;
    const imagePaths = req.files
      ? req.files.map((file) => `/${file.path.replace(/\\/g, "/").replace("public/", "")}`)
      : [];

    const creationObj = {
      id: new mongoose.Types.ObjectId(),
      title,
      description,
      price,
      location,
      bedrooms,
      bathrooms,
      area_sqft,
      property_type,
      status,
      images: imagePaths,
    };

    const property = await PropertiesServices.save(creationObj);


    return res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("POST /api/properties error:", error);
    next(error);
  }
};

// =============================
// Get All Properties
// =============================
export const getAllProperties = async (req, res, next) => {
  try {
    const { city, status: queryStatus, type: queryType } = req.query;
    const filter = { IsStatus: status.active };

    if (city && city.trim()) {
      filter.location = { $regex: new RegExp(city.trim(), 'i') };
    }

    if (queryStatus && queryStatus.trim()) {
      const statusArray = String(queryStatus)
        .split(',')
        .map(s => s.trim());
      if (statusArray.length > 0 && statusArray[0] !== "") {
        filter.status = { $in: statusArray.map(s => new RegExp(`^${s}$`, 'i')) };
      }
    }

    if (queryType && queryType.trim()) {
      const typeArray = String(queryType)
        .split(',')
        .map(t => t.trim().replace(/_/g, ' '));
      if (typeArray.length > 0 && typeArray[0] !== "") {
        filter.property_type = { $in: typeArray.map(t => new RegExp(`^${t}$`, 'i')) };
      }
    }
    console.log(filter);
    const properties = await PropertiesServices.find(filter);

    return res.json(
      properties.map(property => ({
        id: property._id,
        title: property.title,
        Location: property.location,
        Price: property.price,
        Type: property.property_type,
        Beds: property.bedrooms,
        Baths: property.bathrooms,
        area_sqft: property.area_sqft,
        Status: property.status,
        Images: property.images || [],
        createdAt: property.createdAt,
      }))
    );
  } catch (error) {
    console.error("GET /api/properties error:", error);
    next(error);
  }
};

export const getcount = async (req, res, next) => {
  try {
    const [propertiesCountResult, inquiriesCountResult] = await Promise.all([
      PropertiesServices.aggregate([
        { $match: { IsStatus: status.active } },
        { $count: "totalProperties" }
      ]),
      UserServices.aggregate([
        { $match: { role: role.users } },
        { $count: "totalInquiries" }
      ]),
    ]);

    const propertiesCount = propertiesCountResult[0]?.totalProperties || 0;
    const inquiriesCount = inquiriesCountResult[0]?.totalInquiries || 0;

    return res.status(200).json({
      message: "Counts fetched successfully",
      data: {
        propertiesCount,
        inquiriesCount,
      },
    });
  } catch (error) {
    console.error("GET /api/getcount error:", error);
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const property = await PropertiesServices.findOne({
      _id: id,
      IsStatus: status.active,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found or is not active" });
    }

    return res.status(200).json({
      id: property._id,
      title: property.title,
      description: property.description,
      Location: property.location,
      Price: property.price,
      Type: property.property_type,
      Beds: property.bedrooms,
      Baths: property.bathrooms,
      area_sqft: property.area_sqft,
      Status: property.status,
      Images: property.images || [],
      createdAt: property.createdAt,
    });
  } catch (error) {
    console.error("GET /api/properties/:id error:", error);
    next(error);
  }

}

export const getPic = async (req, res, next) => {
  try {
    const query = { IsStatus: status.active };
    const properties = await PropertiesServices.find(query);

    const result = properties
      .filter((property) => property.images && property.images.length > 0)
      .map((property) => ({
        id: property._id,
        title: property.title,
        Type: property.property_type,
        Images: property.images,
        Status: property.IsStatus,
      }));

    return res.json(result);
  } catch (error) {
    console.error("GET /api/properties/pictures error:", error);
    next(error);
  }
};
// =============================
// Delete Property
// =============================
export const deleteProperty = async (req, res, next) => {
  try {
    const id = req.params.id;

    const property = await PropertiesServices.findOne({ _id: id, IsStatus: status.active });

    if (!property) {
      return res.status(404).json({ error: "Property not found or already deleted" });
    }

    await PropertiesServices.updateOne({ _id: id }, { $set: { IsStatus: status.deleted } });

    return res.json({ id, message: "Property deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/properties/:id error:", error);
    next(error);
  }
};


// =============================
// Edit Property (Update Price, Status, Images)
// =============================
export const editProperty = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { price, status } = req.body;

    const property = await PropertiesServices.findOne({
      _id: id,
      IsStatus: { $ne: 0 },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found or deleted" });
    }

    const updateData = {};
    if (price !== undefined) updateData.price = price;
    if (status !== undefined) updateData.status = status;

    await PropertiesServices.updateOne({ _id: id }, { $set: updateData });

    const updated = await PropertiesServices.findOne({ _id: id });

    return res.json({
      message: "Property updated successfully",
      property: {
        id: updated._id,
        title: updated.title,
        description: updated.description,
        location: updated.location,
        price: updated.price,
        property_type: updated.property_type,
        bedrooms: updated.bedrooms,
        bathrooms: updated.bathrooms,
        status: updated.status,
        images: updated.images || [],
        updatedAt: updated.updatedAt,
      },
    });
  } catch (error) {
    console.error("PUT /api/property/:id error:", error);
    next(error);
  }
};
