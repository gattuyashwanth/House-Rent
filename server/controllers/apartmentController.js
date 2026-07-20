import Apartment from "../models/Apartment.js";
import Floor from "../models/Floor.js";
import Room from "../models/Room.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getApartments = asyncHandler(async (req, res) => {
  const apartments = await Apartment.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: apartments.length, data: apartments });
});

export const createApartment = asyncHandler(async (req, res) => {
  const apartment = await Apartment.create(req.body);

  // Automatically create floors and default rooms in MongoDB for the new apartment
  if (apartment.totalFloors > 0) {
    const floorsToCreate = [];
    const roomsToCreate = [];

    for (let f = 1; f <= apartment.totalFloors; f++) {
      floorsToCreate.push({
        apartmentId: apartment._id,
        floorNumber: f,
      });

      for (let r = 1; r <= 3; r++) {
        roomsToCreate.push({
          apartmentId: apartment._id,
          floorNumber: f,
          roomNumber: `${f}0${r}`,
          status: "Vacant",
        });
      }
    }

    await Floor.insertMany(floorsToCreate);
    await Room.insertMany(roomsToCreate);
  }

  res.status(201).json({ success: true, message: "Apartment created successfully", data: apartment });
});

export const updateApartment = asyncHandler(async (req, res) => {
  const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!apartment) throw new ApiError(404, "Apartment not found");
  res.status(200).json({ success: true, message: "Apartment updated successfully", data: apartment });
});

export const deleteApartment = asyncHandler(async (req, res) => {
  const apartment = await Apartment.findByIdAndDelete(req.params.id);
  if (!apartment) throw new ApiError(404, "Apartment not found");

  // Cascade delete associated floors and rooms
  await Floor.deleteMany({ apartmentId: req.params.id });
  await Room.deleteMany({ apartmentId: req.params.id });

  res.status(200).json({ success: true, message: "Apartment deleted successfully" });
});

