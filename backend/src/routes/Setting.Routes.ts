import express from 'express';
import { SettingController } from '../controllers';
import SettingValidator from '../validators/Setting.Validator';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const SettingRouter = express.Router();

SettingRouter.get('/', verifyJwtToken, SettingController.getSettings);
SettingRouter.get('/:key', SettingController.getSettingByKey);
SettingRouter.post(
    '/',
    verifyJwtToken,
    validate(SettingValidator.updateSettingSchema),
    SettingController.updateSetting
);

export default SettingRouter;
