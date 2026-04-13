import { Request, Response } from "express";
import { FloorModel } from "../models";
import { Types } from "mongoose";

class FloorController {
    getFloors = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchTerm = (req.query.search as string) || "";
        const skip = (page - 1) * limit;

        const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {};

        const floors = await FloorModel.find(query).skip(skip).limit(limit);
        const total = await FloorModel.countDocuments(query);
        const lastPage = Math.ceil(total / limit);

        res.json({
            success: true,
            message: "Floors fetched successfully",
            items: floors,
            total,
            currentPage: page,
            lastPage
        });
    }

    getFloor = async (req: Request, res: Response) => {
        const { id } = req.params;

        const floor = await FloorModel.findById(id);

        if (!floor) {
            return res.status(404).json({
                success: false,
                message: "Floor not found"
            });
        }

        res.json({
            success: true,
            message: "Floor fetched successfully",
            data: floor
        });
    }

    createFloor = async (req: Request, res: Response) => {
        const { name } = req.body;

        const floorExists = await FloorModel.findOne({ name });

        if (floorExists) {
            return res.status(400).json({
                success: false,
                message: "Floor already exists"
            });
        }

        const floor = new FloorModel({ name });
        await floor.save();

        res.json({
            success: true,
            message: "Floor created successfully",
            data: floor
        });
    }

    updateFloor = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name } = req.body;

        const floor = await FloorModel.findById(id);

        if (!floor) {
            return res.status(404).json({
                success: false,
                message: "Floor not found"
            });
        }

        const floorExists = await FloorModel.findOne({ name, _id: { $ne: new Types.ObjectId(id as string) } });

        if (floorExists) {
            return res.status(400).json({
                success: false,
                message: "Floor already exists"
            });
        }

        if (name) floor.name = name;

        await floor.save();

        res.json({
            success: true,
            message: "Floor updated successfully",
            data: floor
        });
    }

    deleteFloor = async (req: Request, res: Response) => {
        const { id } = req.params;

        const floor = await FloorModel.findById(id);

        if (!floor) {
            return res.status(404).json({
                success: false,
                message: "Floor not found"
            });
        }

        await floor.deleteOne();

        res.json({
            success: true,
            message: "Floor deleted successfully",
            data: floor
        });
    }

    bulkDeleteFloor = async (req: Request, res: Response) => {
        try {
            const { ids } = req.body;

            if (ids) {
                await FloorModel.deleteMany({ _id: { $in: ids } });
            }

            res.json({
                success: true,
                message: `Floors deleted successfully`,
                data: ids
            });
        } catch (error) {
            console.error("BulkDeleteFloor Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new FloorController();
