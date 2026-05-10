import BaseService from "./BaseService";
import { ResponseModel, SettingModel } from "../models";
import { Config } from "../Config";

export default class SettingService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'settings/';

    public static getSettings(): Promise<ResponseModel<SettingModel[]>> {
        return new Promise((resolve, reject) => {
            this.Http.get(this.API_PREFIX)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static getSettingByKey(key: string): Promise<ResponseModel<SettingModel>> {
        return new Promise((resolve, reject) => {
            this.Http.get(`${this.API_PREFIX}${key}`)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static updateSetting(params: { key: string, value: string }): Promise<ResponseModel<SettingModel>> {
        return new Promise((resolve, reject) => {
            this.Http.post(this.API_PREFIX, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }
}
