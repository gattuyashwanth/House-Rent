import { Router } from "express";
import { adminLogin, tenantLogin } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { adminLoginRules, tenantLoginRules } from "../middleware/validators.js";

const router = Router();

router.post("/admin/login", adminLoginRules, validate, adminLogin);
router.post("/tenant/login", tenantLoginRules, validate, tenantLogin);

export default router;
