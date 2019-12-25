// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    userData,
    userError,
} from '../actions';

const userOptions = (csrfToken?: string): RequestOptions => (
    csrfToken ? {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    } : {
        apiVersion: 'barong',
    });

export const getCsrfToken = () => {
    try {
        const csrfToken = sessionStorage.getItem('csrfToken');
        return csrfToken;
    } catch (error) {
      return undefined;
    }
};

export function* userSaga() {
    try {
        const currentCsrfToken = yield getCsrfToken();
        const user = yield call(API.get(userOptions(currentCsrfToken)), '/resource/users/me');
        const payload = {
            user: user,
        };
        yield put(userData(payload));
    } catch (error) {
        yield put(userError(error));
    }
}
