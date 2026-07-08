import { Request, Response } from "express";
import { StudentRoomModel, SettingModel } from "../models";
import { Types } from "mongoose";

class StudentRoomController {
    getStudentRooms = async (req: Request, res: Response) => {
        const search = req.query.search || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const examType = (req.query.examType as string) || 'UG/PG';
        const skip = (page - 1) * limit;

        const query: any = { examType };

        const { roomNo, room, building, semester, subject, date, time, paper, floor } = req.query;

        const parseArray = (val: any) => {
            if (!val) return null;
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') return val.split(',');
            return null;
        };

        if (roomNo || room) query.roomNo = roomNo || room;

        const bArr = parseArray(building);
        if (bArr) query.building = { $in: bArr };

        const fArr = parseArray(floor);
        if (fArr) query.floor = { $in: fArr };

        const semArr = parseArray(semester);
        if (semArr) query.semester = { $in: semArr.map(Number) };

        const subArr = parseArray(subject);
        if (subArr) query.subject = { $in: subArr };

        const pArr = parseArray(paper);
        if (pArr) query.paper = { $in: pArr };

        if (date) query.date = date;
        if (time) query.time = time;

        if (search) {
            query.$or = [
                { roomNo: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { building: { $regex: search, $options: 'i' } },
                { floor: { $regex: search, $options: 'i' } },
                { paper: { $regex: search, $options: 'i' } },
                { examName: { $regex: search, $options: 'i' } },
                { regNoFrom: { $regex: search, $options: 'i' } },
                { regNoTo: { $regex: search, $options: 'i' } }
            ];
        }

        const rooms = await StudentRoomModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

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
            const { regNo, subject } = req.body;

            // ✅ Validate regNo (must be numeric string)
            if (!/^\d+$/.test(regNo)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid registration number"
                });
            }

            // ✅ Convert to BigInt (SAFE for 20 digits)
            const regNoBig = BigInt(regNo);

            // Fetch settings for display
            const displayDateSetting = await SettingModel.findOne({ key: 'student-allotment-display-date' });
            const displayTimeSetting = await SettingModel.findOne({ key: 'student-allotment-display-time' });

            const displayDateOption = displayDateSetting?.value || 'on_exam_day'; // 'on_exam_day' or 'one_day_before'
            const displayTimeStr = displayTimeSetting?.value || '00:00'; // HH:mm format

            // Get current time in IST
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hourCycle: 'h23'
            });
            const parts = formatter.formatToParts(now);
            const getPart = (type: string) => parts.find(p => p.type === type)?.value;
            
            const istYear = parseInt(getPart('year')!);
            const istMonth = parseInt(getPart('month')!) - 1; // 0-indexed for Date
            const istDay = parseInt(getPart('day')!);
            const currentHour = parseInt(getPart('hour')!);
            const currentMinute = parseInt(getPart('minute')!);

            const [displayHour, displayMinute] = displayTimeStr.split(':').map(Number);
            const ampm = displayHour >= 12 ? 'PM' : 'AM';
            const displayHour12 = displayHour % 12 || 12;
            const displayMinuteStr = displayMinute.toString().padStart(2, '0');
            const displayTimeAMPM = `${displayHour12}:${displayMinuteStr} ${ampm}`;

            const isAfterDisplayTime = (currentHour > displayHour) || (currentHour === displayHour && currentMinute >= displayMinute);

            const allowedDates: Date[] = [];
            const todayUTC = new Date(Date.UTC(istYear, istMonth, istDay));

            allowedDates.push(todayUTC);

            if (displayDateOption === 'one_day_before' && isAfterDisplayTime) {
                const tomorrowUTC = new Date(Date.UTC(istYear, istMonth, istDay + 1));
                allowedDates.push(tomorrowUTC);
            }

            if (allowedDates.length === 0) {
                let msg = `Room allotment will be displayed on exam day at ${displayTimeAMPM}.`;
                if (displayDateOption === 'one_day_before') {
                    msg = `Room allotment will be displayed one day before exam at ${displayTimeAMPM}.`;
                }
                return res.status(403).json({
                    success: false,
                    message: msg
                });
            }

            const query: any = { date: { $in: allowedDates } };
            if (subject) {
                query.subject = subject;
            }

            // ✅ Fetch by date (fast filter)
            const rooms = await StudentRoomModel.find(query);

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
                let msg = `Room allotment will be displayed on exam day at ${displayTimeAMPM}.`;
                if (displayDateOption === 'one_day_before') {
                    msg = `Room allotment will be displayed one day before exam at ${displayTimeAMPM}.`;
                }
                return res.status(404).json({
                    success: false,
                    message: msg
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
    bulkUpdateStudentRoom = async (req: Request, res: Response) => {
        try {
            const { ids, updateData } = req.body;

            if (!ids || ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No IDs provided"
                });
            }

            const result = await StudentRoomModel.updateMany(
                { _id: { $in: ids } },
                { $set: updateData }
            );

            res.json({
                success: true,
                message: "Student rooms updated successfully",
                data: result
            });
        } catch (error) {
            console.error("BulkUpdateStudentRoom Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    getFilterOptions = async (req: Request, res: Response) => {
        try {
            const { examType } = req.query;
            const query: any = {};
            if (examType) query.examType = examType;

            const dates = await StudentRoomModel.distinct('date', query);
            const times = await StudentRoomModel.distinct('time', query);
            const subjects = await StudentRoomModel.distinct('subject', query);
            const papers = await StudentRoomModel.distinct('paper', query);

            res.json({
                success: true,
                message: "Filter options fetched successfully",
                data: {
                    dates: dates.filter(Boolean).map((d: any) => d.toISOString ? d.toISOString().split('T')[0] : String(d).split('T')[0]),
                    times: times.filter(Boolean),
                    subjects: subjects.filter(Boolean),
                    papers: papers.filter(Boolean)
                }
            });
        } catch (error) {
            console.error("GetFilterOptions Error:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    getSubjectsWithExams = async (req: Request, res: Response) => {
        try {
            const { examType } = req.query;
            const query: any = {};
            if (examType) query.examType = examType;

            // Fetch settings for display
            const displayDateSetting = await SettingModel.findOne({ key: 'student-allotment-display-date' });
            const displayTimeSetting = await SettingModel.findOne({ key: 'student-allotment-display-time' });

            const displayDateOption = displayDateSetting?.value || 'on_exam_day'; // 'on_exam_day' or 'one_day_before'
            const displayTimeStr = displayTimeSetting?.value || '00:00'; // HH:mm format

            // Get current time in IST
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hourCycle: 'h23'
            });
            const parts = formatter.formatToParts(now);
            const getPart = (type: string) => parts.find(p => p.type === type)?.value;
            
            const istYear = parseInt(getPart('year')!);
            const istMonth = parseInt(getPart('month')!) - 1; // 0-indexed for Date
            const istDay = parseInt(getPart('day')!);
            const currentHour = parseInt(getPart('hour')!);
            const currentMinute = parseInt(getPart('minute')!);

            const [displayHour, displayMinute] = displayTimeStr.split(':').map(Number);
            const isAfterDisplayTime = (currentHour > displayHour) || (currentHour === displayHour && currentMinute >= displayMinute);

            const allowedDates: Date[] = [];
            const todayUTC = new Date(Date.UTC(istYear, istMonth, istDay));

            allowedDates.push(todayUTC);

            if (displayDateOption === 'one_day_before' && isAfterDisplayTime) {
                const tomorrowUTC = new Date(Date.UTC(istYear, istMonth, istDay + 1));
                allowedDates.push(tomorrowUTC);
            }

            if (allowedDates.length === 0) {
                return res.json({
                    success: true,
                    message: "Subjects fetched successfully",
                    data: []
                });
            }

            query.date = { $in: allowedDates };

            const subjects = await StudentRoomModel.distinct('subject', query);

            res.json({
                success: true,
                message: "Subjects fetched successfully",
                data: subjects.filter(Boolean).sort((a: string, b: string) => a.localeCompare(b))
            });
        } catch (error) {
            console.error("GetSubjectsWithExams Error:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}

export default new StudentRoomController();