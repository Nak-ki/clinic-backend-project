import { model, Schema } from "mongoose";

import { IClinic } from "../interfaces/clinic.interface";

const clinicSchema = new Schema(
    {
        name: { type: String, required: true },
        services: { type: [String] },
        doctors: { type: [{ name: String, id: String }] },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const Clinic = model<IClinic>("clinics", clinicSchema);
