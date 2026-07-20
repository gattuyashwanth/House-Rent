import Admin from "../models/Admin.js";
import Tenant from "../models/Tenant.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateToken } from "../utils/jwt.js";
export const adminLogin = asyncHandler(async (req, res) => {

  
const { username, password } = req.body;



const admin = await Admin.findOne({
  username: username.toLowerCase()
}).select("+password");



if (!admin || !(await admin.comparePassword(password))) {
  throw new ApiError(401, "Invalid username or password");
}
 
  const token = generateToken({ id: admin._id, role: "admin" });
 

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    data: {
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    },
  });
});

export const tenantLogin = asyncHandler(async (req, res) => {
  const { flatNumber, password, apartmentId } = req.body;
  const normalizedFlatNumber = String(flatNumber).trim();

  const query = {
    flatNumber: normalizedFlatNumber,
    isActive: true,
  };

  if (apartmentId) {
    query.apartmentId = apartmentId;
  }

  const tenant = await Tenant.findOne(query)
    .select("+password")
    .populate("apartmentId", "apartmentName city address");

  if (!tenant || !(await tenant.comparePassword(password))) {
    throw new ApiError(401, "Invalid flat number or password");
  }

  const token = generateToken({ id: tenant._id, role: "tenant" });

  res.status(200).json({
    success: true,
    message: "Tenant login successful",
    data: {
      token,
      user: {
        id: tenant._id,
        flatNumber: tenant.flatNumber,
        tenantName: tenant.tenantName,
        mobileNumber: tenant.mobileNumber,
        apartmentId: tenant.apartmentId,
        floorNumber: tenant.floorNumber,
        role: tenant.role,
      },
    },
  });
});
