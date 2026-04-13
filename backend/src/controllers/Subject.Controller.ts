import { Request, Response } from "express";
import { SubjectModel } from "../models";
import { Types } from "mongoose";

class SubjectController {
    getSubjects = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchTerm = (req.query.search as string) || "";
        const skip = (page - 1) * limit;

        const query = searchTerm ? { name: { $regex: searchTerm, $options: 'i' } } : {};

        const subjects = await SubjectModel.find(query).skip(skip).limit(limit);
        const total = await SubjectModel.countDocuments(query);
        const lastPage = Math.ceil(total / limit);

        res.json({
            success: true,
            message: "Subjects fetched successfully",
            items: subjects,
            total,
            currentPage: page,
            lastPage
        });
    }

    getSubject = async (req: Request, res: Response) => {
        const { id } = req.params;

        const subject = await SubjectModel.findById(id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.json({
            success: true,
            message: "Subject fetched successfully",
            data: subject
        });
    }

    createSubject = async (req: Request, res: Response) => {
        const { name } = req.body;

        const subjectExists = await SubjectModel.findOne({ name });

        if (subjectExists) {
            return res.status(400).json({
                success: false,
                message: "Subject already exists"
            });
        }

        const subject = new SubjectModel({ name });
        await subject.save();

        res.json({
            success: true,
            message: "Subject created successfully",
            data: subject
        });
    }

    updateSubject = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name } = req.body;

        const subject = await SubjectModel.findById(id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        const subjectExists = await SubjectModel.findOne({ name, _id: { $ne: new Types.ObjectId(id as string) } });

        if (subjectExists) {
            return res.status(400).json({
                success: false,
                message: "Subject already exists"
            });
        }

        if (name) subject.name = name;

        await subject.save();

        res.json({
            success: true,
            message: "Subject updated successfully",
            data: subject
        });
    }

    deleteSubject = async (req: Request, res: Response) => {
        const { id } = req.params;

        const subject = await SubjectModel.findById(id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        await subject.deleteOne();

        res.json({
            success: true,
            message: "Subject deleted successfully",
            data: subject
        });
    }

    bulkDeleteSubject = async (req: Request, res: Response) => {
        try {
            const { ids } = req.body;

            if (ids) {
                await SubjectModel.deleteMany({ _id: { $in: ids } });
            }

            res.json({
                success: true,
                message: `Subjects deleted successfully`,
                data: ids
            });
        } catch (error) {
            console.error("BulkDeleteSubject Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new SubjectController();
