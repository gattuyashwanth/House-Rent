import Bill from "../models/Bill.js";
import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import Tenant from "../models/Tenant.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getTenantProfile = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.user.id)
    .populate("apartmentId", "apartmentName address city totalFloors image");

  res.status(200).json({ success: true, data: tenant });
});

export const getTenantBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find({ tenantId: req.user.id })
    .populate("apartmentId", "apartmentName city")
    .sort({ year: -1, month: -1 });

  res.status(200).json({ success: true, count: bills.length, data: bills });
});

export const getTenantComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ tenantId: req.user.id })
    .populate("apartmentId", "apartmentName")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: complaints.length, data: complaints });
});

export const createTenantComplaint = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.user.id);

  const imagePath = req.file ? `/uploads/complaints/${req.file.filename}` : null;

  const complaint = await Complaint.create({
    tenantId: tenant._id,
    apartmentId: tenant.apartmentId,
    roomNumber: tenant.flatNumber,
    complaintType: req.body.complaintType,
    description: req.body.description,
    image: imagePath,
  });

  await Notification.create({
    title: "New Complaint",
    message: `${tenant.tenantName} (Flat ${tenant.flatNumber}) submitted a ${req.body.complaintType} complaint.`,
    type: "complaint",
    tenantId: tenant._id,
  });

  const populated = await Complaint.findById(complaint._id).populate("apartmentId", "apartmentName");

  res.status(201).json({
    success: true,
    message: "Complaint submitted successfully",
    data: populated,
  });
});

export const getTenantNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ tenantId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(30);
  const unreadCount = await Notification.countDocuments({ tenantId: req.user.id, isRead: false });

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount,
    data: notifications,
  });
});
