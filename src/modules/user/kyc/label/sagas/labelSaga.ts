// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { getCsrfToken } from '../../../../index';
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
        const currentCsrfToken = yield getCsrfToken();
        const payload = yield call(API.get(userOptions(currentCsrfToken)), '/resource/labels');
        yield put(labelData(payload));
    } catch (error) {
        yield put(labelError(error));
    }
}
