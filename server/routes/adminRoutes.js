import { Router } from "express";
import {
  createApartment,
  deleteApartment,
  getApartments,
  updateApartment,
} from "../controllers/apartmentController.js";
import {
  createBill,
  deleteBill,
  getBills,
  updateBill,
} from "../controllers/billController.js";
import {
  getComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";
import { getAdminDashboard } from "../controllers/dashboardController.js";
import {
  createFloor,
  deleteFloor,
  getFloors,
  updateFloor,
} from "../controllers/floorController.js";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationController.js";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
  updateRoomStatus,
} from "../controllers/roomController.js";
import {
  createTenant,
  deleteTenant,
  getTenants,
  updateTenant,
} from "../controllers/tenantController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  apartmentRules,
  billFilterRules,
  billRules,
  complaintFilterRules,
  complaintStatusRules,
  floorRules,
  mongoIdParam,
  roomRules,
  tenantRules,
} from "../middleware/validators.js";

const router = Router();

// Public routes for guest browsing and flat selection
router.get("/apartments", getApartments);
router.get("/floors", getFloors);
router.get("/rooms", getRooms);

router.use(protect, authorize("admin"));

router.get("/admin/dashboard", getAdminDashboard);

router.post("/apartments", apartmentRules, validate, createApartment);
router.put("/apartments/:id", mongoIdParam(), apartmentRules, validate, updateApartment);
router.delete("/apartments/:id", mongoIdParam(), validate, deleteApartment);

router.post("/floors", floorRules, validate, createFloor);
router.put("/floors/:id", mongoIdParam(), floorRules, validate, updateFloor);
router.delete("/floors/:id", mongoIdParam(), validate, deleteFloor);

router.post("/rooms", roomRules, validate, createRoom);
router.put("/rooms/:id", mongoIdParam(), roomRules, validate, updateRoom);
router.delete("/rooms/:id", mongoIdParam(), validate, deleteRoom);
router.patch("/rooms/:id/status", mongoIdParam(), validate, updateRoomStatus);

router.get("/tenants", getTenants);
router.post("/tenants", tenantRules, validate, createTenant);
router.put("/tenants/:id", mongoIdParam(), tenantRules, validate, updateTenant);
router.delete("/tenants/:id", mongoIdParam(), validate, deleteTenant);

router.get("/bills", billFilterRules, validate, getBills);
router.post("/bills", billRules, validate, createBill);
router.put("/bills/:id", mongoIdParam(), billRules, validate, updateBill);
router.delete("/bills/:id", mongoIdParam(), validate, deleteBill);

router.get("/complaints", complaintFilterRules, validate, getComplaints);
router.patch("/complaints/:id/status", mongoIdParam(), complaintStatusRules, validate, updateComplaintStatus);

router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", mongoIdParam(), validate, markNotificationRead);
router.patch("/notifications/read-all", markAllNotificationsRead);

export default router;
