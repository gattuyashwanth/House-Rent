import Room from "../models/Room.js";
import Tenant from "../models/Tenant.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const syncRoomStatus = async (apartmentId, flatNumber, status) => {
  await Room.findOneAndUpdate(
    { apartmentId, roomNumber: flatNumber },
    { status },
    { new: true }
  );
};

export const getTenants = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.apartmentId) filter.apartmentId = req.query.apartmentId;
  if (req.query.search) {
    const search = req.query.search;
    filter.$or = [
      { tenantName: { $regex: search, $options: "i" } },
      { flatNumber: { $regex: search, $options: "i" } },
      { mobileNumber: { $regex: search, $options: "i" } },
    ];
  }

  const tenants = await Tenant.find(filter)
    .populate("apartmentId", "apartmentName city")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: tenants.length, data: tenants });
});

export const createTenant = asyncHandler(async (req, res) => {
  const { flatNumber, apartmentId, password } = req.body;
  if (!password) throw new ApiError(400, "Password is required for new tenant");

  const tenant = await Tenant.create(req.body);
  await syncRoomStatus(apartmentId, flatNumber, "Occupied");

  const populated = await Tenant.findById(tenant._id).populate("apartmentId", "apartmentName city");
  res.status(201).json({ success: true, message: "Tenant created", data: populated });
});

export const updateTenant = asyncHandler(async (req, res) => {
  const existing = await Tenant.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Tenant not found");

  const { password, ...updates } = req.body;
  Object.assign(existing, updates);
  if (password) existing.password = password;
  await existing.save();

  const tenant = await Tenant.findById(existing._id).populate("apartmentId", "apartmentName city");
  res.status(200).json({ success: true, message: "Tenant updated", data: tenant });
});

export const deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  if (!tenant) throw new ApiError(404, "Tenant not found");

  await syncRoomStatus(tenant.apartmentId, tenant.flatNumber, "Vacant");
  await Tenant.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: "Tenant deleted" });
});
