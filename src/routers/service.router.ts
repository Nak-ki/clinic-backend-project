import { Router } from "express";

import { serviceController } from "../controllers/service.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { ServiceValidator } from "../validators/sevice.validator";

const router = Router();

router.post(
    "/",
    authMiddleware.checkAccessToken,
    userMiddleware.isAdmin,
    commonMiddleware.validateBody(ServiceValidator.create),
    serviceController.create,
);
router.get(
    "/",
    commonMiddleware.isQueryValid(ServiceValidator.query),
    serviceController.getAllServices,
);

export const serviceRouter = router;
