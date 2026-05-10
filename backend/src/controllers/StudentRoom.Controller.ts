import { Request, Response } from "express";
import { StudentRoomModel } from "../models";
import { Types } from "mongoose";

class StudentRoomController {
    getStudentRooms = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const examType = (req.query.examType as string) || 'UG/PG';
        const skip = (page - 1) * limit;

        const query = { examType };

        const rooms = await StudentRoomModel.find(query).skip(skip).limit(limit);

        const total = await StudentRoomModel.countDocuments(query);
        const lastPage = Math.ceil(total / limit);

        res.json({
            success: true,
            message: "Student rooms fetched successfully",
            items: rooms,
            total,
            currentPage: page,
            lastPage
        });
    }

    getStudentRoom = async (req: Request, res: Response) => {
        const { id } = req.params;

        const room = await StudentRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.json({
            success: true,
            message: "Room fetched successfully",
            data: room
        });
    }

    createStudentRoom = async (req: Request, res: Response) => {
        const { roomNo, roomName, floor, building, subject, semester, time, date, regNoFrom, regNoTo, paper, examType, examName } = req.body;

        const query: any = { roomNo, date, regNoFrom, regNoTo, time };
        if (examType === 'UG/PG') { query.subject = subject; query.semester = semester; query.paper = paper; }
        if (examType === 'Others') { query.examName = examName; }

        const roomExists = await StudentRoomModel.findOne(query);

        if (roomExists) {
            return res.status(400).json({
                success: false,
                message: "Room already exists"
            });
        }

        const room = new StudentRoomModel({
            roomNo,
            roomName,
            floor,
            building,
            subject,
            semester,
            time,
            date,
            regNoFrom,
            regNoTo,
            paper,
            examType,
            examName
        });

        await room.save();

        res.json({
            success: true,
            message: "Student room created successfully",
            data: room
        });
    }

    updateStudentRoom = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { roomNo, floor, building, subject, semester, time, date, regNoFrom, regNoTo, paper, examType, examName } = req.body;

        const room = await StudentRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        const query: any = { roomNo, date, regNoFrom, regNoTo, time, _id: { $ne: new Types.ObjectId(id as string) } };
        if (examType === 'UG/PG') { query.subject = subject; query.semester = semester; query.paper = paper; }
        if (examType === 'Others') { query.examName = examName; }

        const roomExists = await StudentRoomModel.findOne(query);

        if (roomExists) {
            return res.status(400).json({
                success: false,
                message: "Room already exists"
            });
        }

        if (roomNo) room.roomNo = roomNo;
        if (floor) room.floor = floor;
        if (building) room.building = building;
        if (subject) room.subject = subject;
        if (semester) room.semester = semester;
        if (time) room.time = time;
        if (date) room.date = date;
        if (regNoFrom) room.regNoFrom = regNoFrom;
        if (regNoTo) room.regNoTo = regNoTo;
        if (paper) room.paper = paper;
        if (examType) room.examType = examType;
        if (examName !== undefined) room.examName = examName;

        await room.save();

        res.json({
            success: true,
            message: "Student room updated successfully",
            data: room
        });
    }

    deleteStudentRoom = async (req: Request, res: Response) => {
        const { id } = req.params;

        const room = await StudentRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        await room.deleteOne();

        res.json({
            success: true,
            message: "Student room deleted successfully",
            data: room
        });
    }

    findStudentRoom = async (req: Request, res: Response) => {
        try {
            const { regNo } = req.body;

            // ✅ Validate regNo (must be numeric string)
            if (!/^\d+$/.test(regNo)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid registration number"
                });
            }

            // ✅ Convert to BigInt (SAFE for 20 digits)
            const regNoBig = BigInt(regNo);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // ✅ Fetch by date only (fast filter)
            const rooms = await StudentRoomModel.find({
                date: today
            });

            // ✅ BigInt comparison (NO precision loss)
            const room = rooms.find(r => {
                try {
                    const from = BigInt(r.regNoFrom);
                    const to = BigInt(r.regNoTo);

                    return regNoBig >= from && regNoBig <= to;
                } catch {
                    return false; // skip invalid data safely
                }
            });

            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: `No exam room found for the registration number on ${today.toDateString()}`
                });
            }

            return res.json({
                success: true,
                message: "Student room found",
                data: {
                    roomNo: room.roomNo,
                    floor: room.floor,
                    building: room.building,
                    subject: room.subject,
                    paper: room.paper,
                    semester: room.semester,
                    time: room.time,
                    date: room.date,
                }
            });

        } catch (error) {
            console.error("FindStudentRoom Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    bulkDeleteStudentRoom = async (req: Request, res: Response) => {
        try {
            const { ids } = req.body;

            if (ids) {
                const result = await StudentRoomModel.deleteMany({ _id: { $in: ids } });
            }

            res.json({
                success: true,
                message: `Student rooms deleted successfully`,
                data: ids
            });
        } catch (error) {
            console.error("BulkDeleteStudentRoom Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new StudentRoomController();