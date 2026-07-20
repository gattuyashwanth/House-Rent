import Bill from "../models/Bill.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { calculateBillTotal } from "../utils/calculateBillTotal.js";

export const getBills = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.apartmentId) filter.apartmentId = req.query.apartmentId;
  if (req.query.tenantId) filter.tenantId = req.query.tenantId;
  if (req.query.month) filter.month = Number(req.query.month);
  if (req.query.year) filter.year = Number(req.query.year);
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

  const bills = await Bill.find(filter)
    .populate("tenantId", "tenantName flatNumber mobileNumber")
    .populate("apartmentId", "apartmentName city")
    .sort({ year: -1, month: -1 });

  res.status(200).json({ success: true, count: bills.length, data: bills });
});

export const createBill = asyncHandler(async (req, res) => {
  const totalAmount = calculateBillTotal(req.body);
  const bill = await Bill.create({ ...req.body, totalAmount });

  const populated = await Bill.findById(bill._id)
    .populate("tenantId", "tenantName flatNumber")
    .populate("apartmentId", "apartmentName city");

  res.status(201).json({ success: true, message: "Bill created", data: populated });
});

export const updateBill = asyncHandler(async (req, res) => {
  const existing = await Bill.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Bill not found");

  const merged = { ...existing.toObject(), ...req.body };
  const totalAmount = calculateBillTotal(merged);

  const bill = await Bill.findByIdAndUpdate(
    req.params.id,
    { ...req.body, totalAmount },
    { new: true, runValidators: true }
  )
    .populate("tenantId", "tenantName flatNumber")
    .populate("apartmentId", "apartmentName city");

  res.status(200).json({ success: true, message: "Bill updated", data: bill });
});

export const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findByIdAndDelete(req.params.id);
  if (!bill) throw new ApiError(404, "Bill not found");
  res.status(200).json({ success: true, message: "Bill deleted" });
});
