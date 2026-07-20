import Apartment from "../models/Apartment.js";
import Bill from "../models/Bill.js";
import Complaint from "../models/Complaint.js";
import Floor from "../models/Floor.js";
import Room from "../models/Room.js";
import Tenant from "../models/Tenant.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [
    totalApartments,
    totalFloors,
    totalRooms,
    occupiedRooms,
    vacantRooms,
    totalTenants,
    pendingComplaints,
    monthlyRevenueAgg,
  ] = await Promise.all([
    Apartment.countDocuments(),
    Floor.countDocuments(),
    Room.countDocuments(),
    Room.countDocuments({ status: "Occupied" }),
    Room.countDocuments({ status: "Vacant" }),
    Tenant.countDocuments({ isActive: true }),
    Complaint.countDocuments({ status: "Pending" }),
    Bill.aggregate([
      {
        $match: {
          month: currentMonth,
          year: currentYear,
          paymentStatus: "Paid",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

  res.status(200).json({
    success: true,
    data: {
      totalApartments,
      totalFloors,
      totalRooms,
      occupiedRooms,
      vacantRooms,
      totalTenants,
      pendingComplaints,
      monthlyRevenue,
      currency: "INR",
    },
  });
});
