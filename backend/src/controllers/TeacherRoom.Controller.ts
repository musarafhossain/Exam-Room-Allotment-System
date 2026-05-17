import { Request, Response } from "express";
import { TeacherRoomModel } from "../models";
import { Types } from "mongoose";

class TeacherRoomController {
    getTeacherRooms = async (req: Request, res: Response) => {
        const rooms = await TeacherRoomModel.find();

        const total = await TeacherRoomModel.countDocuments();

        res.json({
            success: true,
            message: "Teacher rooms fetched successfully",
            items: rooms,
            total
        });
    }

    getTeacherRoom = async (req: Request, res: Response) => {
        const { id } = req.params;

        const room = await TeacherRoomModel.findById(id);

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

    createTeacherRoom = async (req: Request, res: Response) => {
        const { dates, teachers } = req.body;

        const newRecords = [];
        
        for (const teacher of teachers) {
            for (let i = 0; i < dates.length; i++) {
                const dateObj = dates[i];
                if (!teacher.assignments || !teacher.assignments[i]) continue;
                
                const assignment = teacher.assignments[i];
                
                // We store the assignment even if shifts are false so the teacher is tracked
                if (dateObj.date && teacher.name) {
                    newRecords.push({
                        name: teacher.name,
                        date: new Date(dateObj.date),
                        shift1Start: dateObj.shift1Start,
                        shift1End: dateObj.shift1End,
                        shift2Start: dateObj.shift2Start,
                        shift2End: dateObj.shift2End,
                        shift1: assignment.shift1,
                        shift2: assignment.shift2
                    });
                }
            }
        }

        // Clear out existing records to perform a full state synchronization ensuring deletions carry through
        await TeacherRoomModel.deleteMany({});
        
        const created = await TeacherRoomModel.insertMany(newRecords);

        res.json({
            success: true,
            message: "Teacher room assignments created successfully",
            data: created
        });
    }

    updateTeacherRoom = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, date, shift1Start, shift1End, shift2Start, shift2End, shift1, shift2 } = req.body;

        const room = await TeacherRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        if (name !== undefined) room.name = name;
        if (date !== undefined) room.date = date;
        if (shift1Start !== undefined) room.shift1Start = shift1Start;
        if (shift1End !== undefined) room.shift1End = shift1End;
        if (shift2Start !== undefined) room.shift2Start = shift2Start;
        if (shift2End !== undefined) room.shift2End = shift2End;
        if (shift1 !== undefined) room.shift1 = shift1;
        if (shift2 !== undefined) room.shift2 = shift2;

        await room.save();

        res.json({
            success: true,
            message: "Teacher room updated successfully",
            data: room
        });
    }

    deleteTeacherRoom = async (req: Request, res: Response) => {
        const { id } = req.params;

        const room = await TeacherRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        await room.deleteOne();

        res.json({
            success: true,
            message: "Teacher room deleted successfully",
            data: room
        });
    }

    findTeacherRoom = async (req: Request, res: Response) => {
        try {
            const { name, date } = req.body;

            let query: any = {
                name: { $regex: name || "", $options: "i" }
            };

            let dateString = "";

            if (date) {
                const inputDate = new Date(date);
                if (isNaN(inputDate.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid date format"
                    });
                }

                dateString = ` on date ${inputDate.toDateString()}`;

                // Alike search (partial match, case-insensitive)
                // also need to match date exactly or by ignoring time?
                // Since inputDate is typically just the day, let's match the date 
                const startOfDay = new Date(inputDate);
                startOfDay.setUTCHours(0,0,0,0);
                
                const endOfDay = new Date(inputDate);
                endOfDay.setUTCHours(23,59,59,999);

                query.date = { $gte: startOfDay, $lte: endOfDay };
            }

            const rooms = await TeacherRoomModel.find(query);

            if (!rooms || rooms.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `No exam room assignments found for teacher name like "${name}"${dateString}`
                });
            }

            return res.json({
                success: true,
                message: "Teacher room(s) found",
                data: rooms
            });

        } catch (error) {
            console.error("FindTeacherRoom Error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    bulkDeleteTeacherRoom = async (req: Request, res: Response) => {
        try {
            const { ids } = req.body;

            if (ids) {
                await TeacherRoomModel.deleteMany({ _id: { $in: ids } });
            }

            res.json({
                success: true,
                message: `Teacher rooms deleted successfully`,
                data: ids
            });
        } catch (error) {
            console.error("BulkDeleteTeacherRoom Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new TeacherRoomController();
