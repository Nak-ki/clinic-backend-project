import { Router } from "express";

//
import { authController } from "../controllers/auth.controller";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
// import { AuthValidator } from "../validators/auth.validator";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(UserValidator.create),
    authController.signUp,
);

router.post(
    "/sign-in",
    commonMiddleware.validateBody(UserValidator.signIn),
    userMiddleware.isUserExist,
    authController.signIn,
);

router.post("/recover-password", authController.recoveryPasswordSendEmail);

router.patch(
    "/recover-password",
    authMiddleware.checkActionToken(ActionTokenTypeEnum.RECOVERY_PASSWORD),
    authController.recoveryPasswordSet,
);

export const authRouter = router;
