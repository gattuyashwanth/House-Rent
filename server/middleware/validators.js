import { body, param, query } from "express-validator";

export const adminLoginRules = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const tenantLoginRules = [
  body("flatNumber").trim().notEmpty().withMessage("Flat number is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const mongoIdParam = (name = "id") =>
  param(name).isMongoId().withMessage(`Invalid ${name}`);

export const apartmentRules = [
  body("apartmentName").trim().notEmpty().withMessage("Apartment name is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("totalFloors").isInt({ min: 1 }).withMessage("Total floors must be at least 1"),
  body("image").optional().isString(),
];

export const floorRules = [
  body("apartmentId").isMongoId().withMessage("Valid apartment ID is required"),
  body("floorNumber").isInt({ min: 1 }).withMessage("Floor number must be at least 1"),
];

export const roomRules = [
  body("apartmentId").isMongoId().withMessage("Valid apartment ID is required"),
  body("floorNumber").isInt({ min: 1 }).withMessage("Floor number must be at least 1"),
  body("roomNumber").trim().notEmpty().withMessage("Room number is required"),
  body("status").optional().isIn(["Occupied", "Vacant"]),
];

export const tenantRules = [
  body("flatNumber").trim().notEmpty().withMessage("Flat number is required"),
  body("tenantName").trim().notEmpty().withMessage("Tenant name is required"),
  body("mobileNumber").trim().notEmpty().withMessage("Mobile number is required"),
  body("apartmentId").isMongoId().withMessage("Valid apartment ID is required"),
  body("floorNumber").isInt({ min: 1 }).withMessage("Floor number must be at least 1"),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const billRules = [
  body("tenantId").isMongoId().withMessage("Valid tenant ID is required"),
  body("apartmentId").isMongoId().withMessage("Valid apartment ID is required"),
  body("roomNumber").trim().notEmpty().withMessage("Room number is required"),
  body("month").isInt({ min: 1, max: 12 }).withMessage("Month must be between 1 and 12"),
  body("year").isInt({ min: 2000 }).withMessage("Valid year is required"),
  body("rentAmount").isFloat({ min: 0 }).withMessage("Rent amount must be non-negative"),
  body("electricityBill").optional().isFloat({ min: 0 }),
  body("waterBill").optional().isFloat({ min: 0 }),
  body("maintenanceBill").optional().isFloat({ min: 0 }),
  body("generatorCharges").optional().isFloat({ min: 0 }),
  body("paymentStatus").optional().isIn(["Pending", "Paid", "Overdue"]),
];

export const complaintStatusRules = [
  body("status").isIn(["Pending", "In Progress", "Completed"]).withMessage("Invalid status"),
];

export const tenantComplaintRules = [
  body("complaintType")
    .isIn([
      "Water Leakage",
      "Power Issue",
      "Lift Problem",
      "Drainage Issue",
      "Security Complaint",
      "Cleaning Request",
    ])
    .withMessage("Invalid complaint type"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];

export const billFilterRules = [
  query("apartmentId").optional().isMongoId().withMessage("Invalid apartment ID"),
  query("month").optional().isInt({ min: 1, max: 12 }),
  query("year").optional().isInt({ min: 2000 }),
];

export const complaintFilterRules = [
  query("status").optional().isIn(["Pending", "In Progress", "Completed"]),
  query("apartmentId").optional().isMongoId(),
];
