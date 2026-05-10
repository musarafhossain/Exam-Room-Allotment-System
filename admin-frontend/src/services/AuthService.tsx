import BaseService from "./BaseService";
import { ResponseModel } from "models";
import { Config } from "Config";
import { UserModel } from "models";

export default class AuthService extends BaseService {
    static API_PREFIX = Config.API.URL + 'auth/';

    static getMe(params = {}): Promise<ResponseModel<UserModel>> {
        AuthService.initCancelToken();

        return new Promise((resolve, reject) => {
            this.Http.get(this.API_PREFIX + 'me', {
                params,
                cancelToken: AuthService.source?.token,
            })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => reject(err));
        });
    }

    static login(params = {}): Promise<ResponseModel<{ user: UserModel; token: string }>> {
        AuthService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.post(this.API_PREFIX + 'login', params, { cancelToken: AuthService.source?.token })
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    static logout(): Promise<ResponseModel<null>> {
        AuthService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.post(this.API_PREFIX + 'logout', {}, { cancelToken: AuthService.source?.token })
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    static forgotPassword(params: { email: string }): Promise<ResponseModel<null>> {
        AuthService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.post(this.API_PREFIX + 'forgot-password', params, { cancelToken: AuthService.source?.token })
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }
}