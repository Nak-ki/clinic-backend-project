import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

import { config } from "../configs/configs";
import { emailConstants } from "../constants/email.constants";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailTypeToPayload } from "../types/email-type-to-payload.type";

class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            from: "No reply",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASSWORD,
            },
        });

        const hbsOptions = {
            viewEngine: {
                extname: ".hbs",
                defaultLayout: "main",
                layoutsDir: path.join(
                    process.cwd(),
                    "src",
                    "templates",
                    "layouts",
                ),
                partialsDir: path.join(
                    process.cwd(),
                    "src",
                    "templates",
                    "partials",
                ),
            },
            viewPath: path.join(process.cwd(), "src", "templates", "views"),
            extName: ".hbs",
        };

        this.transporter.use("compile", hbs(hbsOptions));
    }

    public async sendMail<T extends EmailTypeEnum>(
        type: T,
        to: string,
        context: EmailTypeToPayload[T],
    ): Promise<void> {
        const { subject, template } = emailConstants[type];

        const options = { to, subject, template, context };
        await this.transporter.sendMail(options);
    }
}

export const emailService = new EmailService();
