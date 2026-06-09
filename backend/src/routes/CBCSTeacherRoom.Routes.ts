import express from 'express';
import { CBCSTeacherRoomController } from '../controllers';
import { CBCSTeacherRoomValidator } from '../validators';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const CBCSTeacherRoomRouter = express.Router();

CBCSTeacherRoomRouter.get('/', verifyJwtToken, CBCSTeacherRoomController.getTeacherRooms);

CBCSTeacherRoomRouter.get('/:id', verifyJwtToken, CBCSTeacherRoomController.getTeacherRoom);

CBCSTeacherRoomRouter.post(
    '/',
    verifyJwtToken,
    validate(CBCSTeacherRoomValidator.createTeacherRoomSchema),
    CBCSTeacherRoomController.createTeacherRoom
);

CBCSTeacherRoomRouter.patch(
    '/:id',
    verifyJwtToken,
    validate(CBCSTeacherRoomValidator.updateTeacherRoomSchema),
    CBCSTeacherRoomController.updateTeacherRoom
);

CBCSTeacherRoomRouter.delete('/:id', verifyJwtToken, CBCSTeacherRoomController.deleteTeacherRoom);

CBCSTeacherRoomRouter.post(
    "/find-teacher-room",
    validate(CBCSTeacherRoomValidator.findTeacherRoomSchema),
    CBCSTeacherRoomController.findTeacherRoom
);

CBCSTeacherRoomRouter.post(
    "/bulk-delete",
    verifyJwtToken,
    CBCSTeacherRoomController.bulkDeleteTeacherRoom
);

export default CBCSTeacherRoomRouter;
