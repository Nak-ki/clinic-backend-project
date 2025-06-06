import { FilterQuery } from "mongoose";

import {
    ICreateDoctor,
    IDoctor,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";

class DoctorRepository {
    public create(doctor: ICreateDoctor): Promise<IDoctor> {
        return Doctor.create(doctor);
    }

    public getByParams(email: string): Promise<IDoctor> {
        return Doctor.findOne({ email });
    }

    public async getAll(
        query: IDoctorQuery,
    ): Promise<[IDoctor[], number, number, number]> {
        const page = query.page ? query.page : 1;
        const skip = +query.limit * (+page - 1);
        const filterObject: FilterQuery<IDoctorQuery> = {};

        if (query.name) {
            filterObject.name = { $regex: query.name, $options: "i" };
        }
        if (query.surname) {
            filterObject.surname = { $regex: query.surname, $options: "i" };
        }
        if (query.email) {
            filterObject.email = { $regex: query.email, $options: "i" };
        }
        if (query.phone) {
            filterObject.phone = { $regex: query.phone, $options: "i" };
        }

        let sortObject: Record<string, 1 | -1>;

        if (query.order === "asc") {
            sortObject = { [query.orderBy]: 1 };
        } else if (query.order === "desc") {
            sortObject = { [query.orderBy]: -1 };
        }

        return await Promise.all([
            Doctor.find(filterObject)
                .limit(+query.limit)
                .skip(skip)
                .sort(sortObject),
            +query.limit,
            page,
            query.name || query.surname || query.phone || query.email
                ? Doctor.countDocuments(filterObject)
                : Doctor.countDocuments(),
        ]);
    }
}

export const doctorRepository = new DoctorRepository();
