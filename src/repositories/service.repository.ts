import { FilterQuery } from "mongoose";

import {
    IService,
    IServiceCreateDTO,
    IServiceQuery,
} from "../interfaces/service.interface";
import { Service } from "../models/service.model";

class ServiceRepository {
    public create(service: IServiceCreateDTO): Promise<IService> {
        return Service.create(service);
    }

    public getByParams(name: string): Promise<IService> {
        return Service.findOne({ name });
    }

    public async getAll(
        query: IServiceQuery,
    ): Promise<[IService[], number, number, number]> {
        const page = query.page ? query.page : 1;
        const skip = +query.limit * (+page - 1);
        const filterObject: FilterQuery<IServiceQuery> = {};

        if (query.search) {
            filterObject.name = { $regex: query.search, $options: "i" };
        }
        let sortObject: Record<string, 1 | -1>;

        if (query.order === "asc") {
            sortObject = { name: 1 };
        } else if (query.order === "desc") {
            sortObject = { name: -1 };
        }

        return await Promise.all([
            Service.find(filterObject)
                .limit(+query.limit)
                .skip(skip)
                .sort(sortObject),
            +query.limit,
            page,
            query.search
                ? Service.countDocuments(filterObject)
                : Service.countDocuments(),
        ]);
    }
}

export const serviceRepository = new ServiceRepository();
