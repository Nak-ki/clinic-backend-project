// import { FilterQuery } from "mongoose";

import { FilterQuery } from "mongoose";

import {
    IClinic,
    IClinicsQuery,
    ICreateClinic,
} from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";

class ClinicRepository {
    public create(clinic: ICreateClinic): Promise<IClinic> {
        return Clinic.create(clinic);
    }

    public getByParams(name: string): Promise<IClinic> {
        return Clinic.findOne({ name });
    }

    public async getAll(
        query: IClinicsQuery,
    ): Promise<[IClinic[], number, number, number]> {
        const page = query.page ? query.page : 1;
        const skip = +query.limit * (+page - 1);
        let filterObject: FilterQuery<IClinicsQuery> = {};

        if (query.search) {
            filterObject.name = { $regex: query.search, $options: "i" };
        }
        if (query.service) {
            filterObject.services = { $in: query.service };
        }
        // if (query.doctor) {
        //     filterObject = {
        //         ...filterObject,
        //         doctors: { $all: [{ $elemMatch: { name: query.doctor } }] },
        //     };
        // }
        if (query.doctor) {
            filterObject.doctors = {
                $all: [{ $elemMatch: { name: query.doctor } }],
            };
        }
        let sortObject: Record<string, 1 | -1>;

        if (query.order === "asc") {
            sortObject = { name: 1 };
        } else if (query.order === "desc") {
            sortObject = { name: -1 };
        }

        return await Promise.all([
            Clinic.find(filterObject)
                .limit(+query.limit)
                .skip(skip)
                .sort(sortObject),
            +query.limit,
            page,
            query.search || query.service || query.doctor
                ? Clinic.countDocuments(filterObject)
                : Clinic.countDocuments(),
        ]);
    }

    public update(clinic: {
        _id: string;
        name: string;
        services: string[];
        doctors: { name: string; _id: string }[];
    }): Promise<IClinic> {
        return Clinic.findByIdAndUpdate(clinic._id, clinic, { new: true });
    }
}

export const clinicRepository = new ClinicRepository();
