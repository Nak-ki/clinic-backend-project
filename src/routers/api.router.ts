import { Router } from "express";

import { authRouter } from "./auth.router";
import { clinicRouter } from "./clinic.router";
import { doctorRouter } from "./doctor.router";
import { serviceRouter } from "./service.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/services", serviceRouter);
router.use("/clinics", clinicRouter);
router.use("/doctors", doctorRouter);

export const apiRouter = router;
