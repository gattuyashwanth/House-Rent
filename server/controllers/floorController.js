import Floor from "../models/Floor.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getFloors = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.apartmentId) filter.apartmentId = req.query.apartmentId;

  const floors = await Floor.find(filter)
    .populate("apartmentId", "apartmentName city")
    .sort({ floorNumber: 1 });

  res.status(200).json({ success: true, count: floors.length, data: floors });
});

export const createFloor = asyncHandler(async (req, res) => {
  const floor = await Floor.create(req.body);
  res.status(201).json({ success: true, message: "Floor created", data: floor });
});

export const updateFloor = asyncHandler(async (req, res) => {
  const floor = await Floor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!floor) throw new ApiError(404, "Floor not found");
  res.status(200).json({ success: true, message: "Floor updated", data: floor });
});

export const deleteFloor = asyncHandler(async (req, res) => {
  const floor = await Floor.findByIdAndDelete(req.params.id);
  if (!floor) throw new ApiError(404, "Floor not found");
  res.status(200).json({ success: true, message: "Floor deleted" });
});
