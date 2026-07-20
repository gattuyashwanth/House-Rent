import { Router } from "express";
import {
  createTenantComplaint,
  getTenantBills,
  getTenantComplaints,
  getTenantNotifications,
  getTenantProfile,
} from "../controllers/tenantPortalController.js";
import { authorize, protect } from "../middleware/auth.js";
import { uploadComplaintImage } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { tenantComplaintRules } from "../middleware/validators.js";

const router = Router();

router.use(protect, authorize("tenant"));

router.get("/profile", getTenantProfile);
router.get("/bills", getTenantBills);
router.get("/complaints", getTenantComplaints);
router.post("/complaints", uploadComplaintImage, tenantComplaintRules, validate, createTenantComplaint);
router.get("/notifications", getTenantNotifications);

export default router;
