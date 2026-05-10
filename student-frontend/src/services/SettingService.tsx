import BaseService from "./BaseService";
import { ResponseModel } from "../models";
import { Config } from "../Config";

export interface SettingModel {
    id: string;
    key: string;
    value: string;
    createdAt: string;
    updatedAt: string;
}

export default class SettingService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'settings/';

    public static getSettingByKey(key: string): Promise<ResponseModel<SettingModel>> {
        return new Promise((resolve, reject) => {
            this.Http.get(`${this.API_PREFIX}${key}`)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }
}
