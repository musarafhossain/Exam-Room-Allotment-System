import { Request, Response } from "express";
import { PaperModel } from "../models";
import { Types } from "mongoose";

class PaperController {
    getPapers = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchTerm = (req.query.search as string) || "";
        const skip = (page - 1) * limit;

        const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {};

        const papers = await PaperModel.find(query).skip(skip).limit(limit);
        const total = await PaperModel.countDocuments(query);
        const lastPage = Math.ceil(total / limit);

        res.json({
            success: true,
            message: "Papers fetched successfully",
            items: papers,
            total,
            currentPage: page,
            lastPage
        });
    }

    getPaper = async (req: Request, res: Response) => {
        const { id } = req.params;

        const paper = await PaperModel.findById(id);

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Paper not found"
            });
        }

        res.json({
            success: true,
            message: "Paper fetched successfully",
            data: paper
        });
    }

    createPaper = async (req: Request, res: Response) => {
        const { name } = req.body;

        const paperExists = await PaperModel.findOne({ name });

        if (paperExists) {
            return res.status(400).json({
                success: false,
                message: "Paper already exists"
            });
        }

        const paper = new PaperModel({ name });
        await paper.save();

        res.json({
            success: true,
            message: "Paper created successfully",
            data: paper
        });
    }

    updatePaper = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name } = req.body;

        const paper = await PaperModel.findById(id);

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Paper not found"
            });
        }

        const paperExists = await PaperModel.findOne({ name, _id: { $ne: new Types.ObjectId(id as string) } });

        if (paperExists) {
            return res.status(400).json({
                success: false,
                message: "Paper already exists"
            });
        }

        if (name) paper.name = name;

        await paper.save();

        res.json({
            success: true,
            message: "Paper updated successfully",
            data: paper
        });
    }

    deletePaper = async (req: Request, res: Response) => {
        const { id } = req.params;

        const paper = await PaperModel.findById(id);

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: "Paper not found"
            });
        }

        await paper.deleteOne();

        res.json({
            success: true,
            message: "Paper deleted successfully",
            data: paper
        });
    }

    bulkDeletePaper = async (req: Request, res: Response) => {
        try {
            const { ids } = req.body;

            if (ids) {
                await PaperModel.deleteMany({ _id: { $in: ids } });
            }

            res.json({
                success: true,
                message: `Papers deleted successfully`,
                data: ids
            });
        } catch (error) {
            console.error("BulkDeletePaper Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new PaperController();
