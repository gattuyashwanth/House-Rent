import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getComplaints = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.apartmentId) filter.apartmentId = req.query.apartmentId;
  if (req.query.tenantId) filter.tenantId = req.query.tenantId;

  const complaints = await Complaint.find(filter)
    .populate("tenantId", "tenantName flatNumber mobileNumber")
    .populate("apartmentId", "apartmentName city")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: complaints.length, data: complaints });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
    .populate("tenantId", "tenantName flatNumber")
    .populate("apartmentId", "apartmentName");

  if (!complaint) throw new ApiError(404, "Complaint not found");

  await Notification.create({
    title: "Complaint Status Updated",
    message: `${complaint.complaintType} complaint for Flat ${complaint.roomNumber} is now ${status}.`,
    type: "complaint",
    tenantId: complaint.tenantId,
  });

  res.status(200).json({ success: true, message: "Complaint status updated", data: complaint });
});
