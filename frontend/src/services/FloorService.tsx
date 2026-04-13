import BaseService from "./BaseService";
import { ResponseModel, FloorModel } from "../models";
import { Config } from "../Config";

export default class FloorService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'floors/';
    
    public static getList(params = {}): Promise<ResponseModel<FloorModel>> {
        FloorService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(this.API_PREFIX, { params, cancelToken: FloorService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static getById(id: string, params = {}): Promise<ResponseModel<FloorModel>> {
        FloorService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(`${this.API_PREFIX}${id}`, { params, cancelToken: FloorService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static create(params = {}): Promise<ResponseModel<FloorModel>> {
        return new Promise((resolve, reject) => {
            this.Http.post(this.API_PREFIX, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static update(id: string, params = {}): Promise<ResponseModel<FloorModel>> {
        return new Promise((resolve, reject) => {
            this.Http.patch(`${this.API_PREFIX}${id}`, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static delete(id: string, params = {}): Promise<ResponseModel<FloorModel>> {
        return new Promise((resolve, reject) => {
            this.Http.delete(`${this.API_PREFIX}${id}`, {
                params,
                cancelToken: FloorService.source?.token,
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
