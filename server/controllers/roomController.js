import Room from "../models/Room.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getRooms = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.apartmentId) filter.apartmentId = req.query.apartmentId;
  if (req.query.floorNumber) filter.floorNumber = Number(req.query.floorNumber);
  if (req.query.status) filter.status = req.query.status;

  const rooms = await Room.find(filter)
    .populate("apartmentId", "apartmentName city")
    .sort({ floorNumber: 1, roomNumber: 1 });

  res.status(200).json({ success: true, count: rooms.length, data: rooms });
});

export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json({ success: true, message: "Room created", data: room });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!room) throw new ApiError(404, "Room not found");
  res.status(200).json({ success: true, message: "Room updated", data: room });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) throw new ApiError(404, "Room not found");
  res.status(200).json({ success: true, message: "Room deleted" });
});

export const updateRoomStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["Occupied", "Vacant"].includes(status)) {
    throw new ApiError(400, "Status must be Occupied or Vacant");
  }

  const room = await Room.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!room) throw new ApiError(404, "Room not found");

  res.status(200).json({ success: true, message: "Room status updated", data: room });
});
