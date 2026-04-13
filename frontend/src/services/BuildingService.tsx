import BaseService from "./BaseService";
import { ResponseModel, PageModel, BuildingModel } from "../models";
import { Config } from "../Config";

export default class BuildingService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'buildings/';
    
    public static getList(params = {}): Promise<ResponseModel<BuildingModel>> {
        BuildingService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(this.API_PREFIX, { params, cancelToken: BuildingService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static getById(id: string, params = {}): Promise<ResponseModel<BuildingModel>> {
        BuildingService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(`${this.API_PREFIX}${id}`, { params, cancelToken: BuildingService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static create(params = {}): Promise<ResponseModel<BuildingModel>> {
        return new Promise((resolve, reject) => {
            this.Http.post(this.API_PREFIX, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static update(id: string, params = {}): Promise<ResponseModel<BuildingModel>> {
        return new Promise((resolve, reject) => {
            this.Http.patch(`${this.API_PREFIX}${id}`, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static delete(id: string, params = {}): Promise<ResponseModel<BuildingModel>> {
        return new Promise((resolve, reject) => {
            this.Http.delete(`${this.API_PREFIX}${id}`, {
                params,
                cancelToken: BuildingService.source?.token,
            })
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static bulkDelete(ids: string[]): Promise<ResponseModel<any>> {
        return new Promise((resolve, reject) => {
            this.Http.post(`${this.API_PREFIX}bulk-delete`, { ids })
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }
}
