// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { getUserInfo } from '../../../../index';
import {
    labelData,
    labelError,
} from '../actions';

const userOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* labelSaga() {
    try {
        const currentUserInfo = yield getUserInfo();
        const payload = yield call(API.get(userOptions(currentUserInfo && currentUserInfo.csrf_token)), '/resource/labels');
        yield put(labelData(payload));
    } catch (error) {
        yield put(labelError(error));
    }
}
