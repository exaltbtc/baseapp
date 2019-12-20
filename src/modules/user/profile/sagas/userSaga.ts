// tslint:disable-next-line
import { call, put, select } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    userData,
    userError,
} from '../actions';
import { selectUserInfo } from '../selectors';

const userOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* getUserInfo() {
    try {
        return yield select(selectUserInfo);
    } catch (error) {
        return;
    }
}

export function* userSaga() {
    try {
        const currentUserInfo = yield getUserInfo();
        const user = yield call(API.get(userOptions(currentUserInfo && currentUserInfo.csrf_token)), '/resource/users/me');
        const payload = {
            user: user,
        };
        yield put(userData(payload));
    } catch (error) {
        yield put(userError(error));
    }
}
