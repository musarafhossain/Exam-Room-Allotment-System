import { Request, Response } from "express";
import { BuildingModel } from "../models";
import { Types } from "mongoose";

class BuildingController {
    getBuildings = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchTerm = (req.query.search as string) || "";
        const skip = (page - 1) * limit;

        const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {};

        const buildings = await BuildingModel.find(query).skip(skip).limit(limit);
        const total = await BuildingModel.countDocuments(query);
        const lastPage = Math.ceil(total / limit);

        res.json({
            success: true,
            message: "Buildings fetched successfully",
            items: buildings,
            total,
            currentPage: page,
            lastPage
        });
    }

    getBuilding = async (req: Request, res: Response) => {
        const { id } = req.params;

        const building = await BuildingModel.findById(id);

        if (!building) {
            return res.status(404).json({
                success: false,
                message: "Building not found"
            });
        }

        res.json({
            success: true,
            message: "Building fetched successfully",
            data: building
        });
    }

    createBuilding = async (req: Request, res: Response) => {
        const { name } = req.body;

        const buildingExists = await BuildingModel.findOne({ name });

        if (buildingExists) {
            return res.status(400).json({
                success: false,
                message: "Building already exists"
            });
        }

        const building = new BuildingModel({ name });
        await building.save();

        res.json({
            success: true,
            message: "Building created successfully",
            data: building
        });
    }

    updateBuilding = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name } = req.body;

        const building = await BuildingModel.findById(id);

        if (!building) {
            return res.status(404).json({
                success: false,
                message: "Building not found"
            });
        }

        const buildingExists = await BuildingModel.findOne({ name, _id: { $ne: new Types.ObjectId(id as string) } });

        if (buildingExists) {
            return res.status(400).json({
                success: false,
                message: "Building already exists"
            });
        }

        if (name) building.name = name;

        await building.save();

        res.json({
            success: true,
            message: "Building updated successfully",
            data: building
        });
    }

    deleteBuilding = async (req: Request, res: Response) => {
        const { id } = req.params;

        const building = await BuildingModel.findById(id);

        if (!building) {
            return res.status(404).json({
                success: false,
                message: "Building not found"
            });
        }

        await building.deleteOne();

        res.json({
            success: true,
            message: "Building deleted successfully",
            data: building
        });
    }

    bulkDeleteBuilding = async (req: Request, res: Response) => {
        try {
            const { ids } = req.body;

            if (ids) {
                await BuildingModel.deleteMany({ _id: { $in: ids } });
            }

            res.json({
                success: true,
                message: `Buildings deleted successfully`,
                data: ids
            });
        } catch (error) {
            console.error("BulkDeleteBuilding Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new BuildingController();
