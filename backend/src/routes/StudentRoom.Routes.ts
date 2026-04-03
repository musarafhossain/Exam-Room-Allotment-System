import express from 'express';
import { StudentRoomController } from '../controllers';
import { StudentRoomValidator } from '../validators';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const StudentRoomRouter = express.Router();

StudentRoomRouter.get('/', verifyJwtToken, StudentRoomController.getStudentRooms);

StudentRoomRouter.get('/:id', verifyJwtToken, StudentRoomController.getStudentRoom);

StudentRoomRouter.post(
    '/',
    verifyJwtToken,
    validate(StudentRoomValidator.createStudentRoomSchema),
    StudentRoomController.createStudentRoom
);

StudentRoomRouter.patch(
    '/:id',
    verifyJwtToken,
    validate(StudentRoomValidator.updateStudentRoomSchema),
    StudentRoomController.updateStudentRoom
);

StudentRoomRouter.delete('/:id', verifyJwtToken, StudentRoomController.deleteStudentRoom);

StudentRoomRouter.post(
    "/find-student-room",
    validate(StudentRoomValidator.findStudentRoomSchema),
    StudentRoomController.findStudentRoom
);

StudentRoomRouter.post(
    "/bulk-delete",
    StudentRoomController.bulkDeleteStudentRoom
);

export default StudentRoomRouter;