import { Router } from "express";

import { clinicController } from "../controllers/clinic.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { ClinicValidator } from "../validators/clinic.validator";

const router = Router();

router.post(
    "/",
    authMiddleware.checkAccessToken,
    userMiddleware.isAdmin,
    commonMiddleware.validateBody(ClinicValidator.create),
    clinicController.create,
);
router.get(
    "/",
    commonMiddleware.isQueryValid(ClinicValidator.query),
    clinicController.getAllClinics,
);

export const clinicRouter = router;
