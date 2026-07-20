import Admin from "../models/Admin.js";
import Tenant from "../models/Tenant.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token === "null" || token === "undefined") {
    throw new ApiError(401, "Not authorized. Please login.");
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired. Please login again.");
    }
    throw new ApiError(401, "Invalid token. Authorization failed.");
  }

  if (!decoded || !decoded.id || !decoded.role) {
    throw new ApiError(401, "Malformed authorization token.");
  }

  if (decoded.role === "admin") {
    const admin = await Admin.findById(decoded.id);
    if (!admin) throw new ApiError(401, "Admin user no longer exists");
    req.user = { id: admin._id, role: "admin", username: admin.username };
  } else if (decoded.role === "tenant") {
    const tenant = await Tenant.findById(decoded.id);
    if (!tenant) throw new ApiError(401, "Tenant user no longer exists");
    if (!tenant.isActive) throw new ApiError(403, "Your account has been deactivated");
    req.user = {
      id: tenant._id,
      role: "tenant",
      flatNumber: tenant.flatNumber,
      apartmentId: tenant.apartmentId,
    };
  } else {
    throw new ApiError(401, "Invalid token role specified");
  }

  next();
});

export const authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "Access forbidden. Insufficient permissions.");
    }
    next();
  });

