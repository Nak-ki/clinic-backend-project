import { EmailTypeEnum } from "../enums/email-type.enum";

export const emailConstants = {
    [EmailTypeEnum.RECOVERY_PASSWORD]: {
        subject: "Recovery password",
        template: "recovery-password",
    },
};
