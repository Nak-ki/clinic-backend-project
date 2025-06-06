import joi from "joi";

import { RegexEnum } from "../enums/regex.enum";

export class UserValidator {
    private static email = joi.string().regex(RegexEnum.EMAIL).trim();
    private static password = joi.string().regex(RegexEnum.PASSWORD);
    private static name = joi.string().regex(RegexEnum.NAME);
    private static surname = joi.string().regex(RegexEnum.NAME);

    public static create = joi.object({
        email: this.email.required(),
        password: this.password.required(),
        name: this.name.required(),
        surname: this.surname.required(),
    });
    //
    // public static update = joi.object({
    //     name: this.name.required(),
    //     surname: this.surname.required(),
    // });

    public static signIn = joi.object({
        email: this.email.required(),
        password: this.password.required(),
    });

    // public static query = joi.object({
    //     pageSize: joi.number().min(1).max(100).default(10),
    //     page: joi.number().min(1).default(1),
    //     search: joi.string().trim(),
    //     order: joi
    //         .string()
    //         .valid(
    //             ...Object.values(UserQueryOrderEnum),
    //             ...Object.values(UserQueryOrderEnum).map((item) => `-${item}`),
    //         ),
    // });
}
