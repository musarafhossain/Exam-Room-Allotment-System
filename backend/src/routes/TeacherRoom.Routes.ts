import express from 'express';
import { TeacherRoomController } from '../controllers';
import { TeacherRoomValidator } from '../validators';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const TeacherRoomRouter = express.Router();

TeacherRoomRouter.get('/', verifyJwtToken, TeacherRoomController.getTeacherRooms);

TeacherRoomRouter.get('/:id', verifyJwtToken, TeacherRoomController.getTeacherRoom);

TeacherRoomRouter.post(
    '/',
    verifyJwtToken,
    validate(TeacherRoomValidator.createTeacherRoomSchema),
    TeacherRoomController.createTeacherRoom
);

TeacherRoomRouter.patch(
    '/:id',
    verifyJwtToken,
    validate(TeacherRoomValidator.updateTeacherRoomSchema),
    TeacherRoomController.updateTeacherRoom
);

TeacherRoomRouter.delete('/:id', verifyJwtToken, TeacherRoomController.deleteTeacherRoom);

TeacherRoomRouter.post(
    "/bulk-delete",
    verifyJwtToken,
    TeacherRoomController.bulkDeleteTeacherRoom
);

export default TeacherRoomRouter;
