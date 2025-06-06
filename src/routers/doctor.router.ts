import { Router } from "express";

import { doctorController } from "../controllers/doctor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { clinicMiddleware } from "../middlewares/clinic.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { serviceMiddleware } from "../middlewares/service.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { DoctorValidator } from "../validators/doctor.validator";

const router = Router();

router.post(
    "/",
    authMiddleware.checkAccessToken,
    userMiddleware.isAdmin,
    commonMiddleware.validateBody(DoctorValidator.create),
    clinicMiddleware.isClinicExist,
    serviceMiddleware.isServiceExist,
    doctorController.create,
);

router.get(
    "/",
    commonMiddleware.isQueryValid(DoctorValidator.query),
    doctorController.getAllDoctors,
);

export const doctorRouter = router;
