import express from 'express';
import { BuildingController } from '../controllers';
import { BuildingValidator } from '../validators';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const BuildingRouter = express.Router();

BuildingRouter.get('/', verifyJwtToken, BuildingController.getBuildings);

BuildingRouter.get('/:id', verifyJwtToken, BuildingController.getBuilding);

BuildingRouter.post(
    '/',
    verifyJwtToken,
    validate(BuildingValidator.createBuildingSchema),
    BuildingController.createBuilding
);

BuildingRouter.patch(
    '/:id',
    verifyJwtToken,
    validate(BuildingValidator.updateBuildingSchema),
    BuildingController.updateBuilding
);

BuildingRouter.delete('/:id', verifyJwtToken, BuildingController.deleteBuilding);

BuildingRouter.post(
    "/bulk-delete",
    verifyJwtToken,
    BuildingController.bulkDeleteBuilding
);

export default BuildingRouter;
