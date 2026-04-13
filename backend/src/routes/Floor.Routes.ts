import express from 'express';
import { FloorController } from '../controllers';
import { FloorValidator } from '../validators';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const FloorRouter = express.Router();

FloorRouter.get('/', verifyJwtToken, FloorController.getFloors);

FloorRouter.get('/:id', verifyJwtToken, FloorController.getFloor);

FloorRouter.post(
    '/',
    verifyJwtToken,
    validate(FloorValidator.createFloorSchema),
    FloorController.createFloor
);

FloorRouter.patch(
    '/:id',
    verifyJwtToken,
    validate(FloorValidator.updateFloorSchema),
    FloorController.updateFloor
);

FloorRouter.delete('/:id', verifyJwtToken, FloorController.deleteFloor);

FloorRouter.post(
    "/bulk-delete",
    FloorController.bulkDeleteFloor
);

export default FloorRouter;
