// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import {
    beneficiariesData,
    beneficiariesError,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* beneficiariesSaga() {
    try {
        const currentCsrfToken = yield getCsrfToken();
        const beneficiaries = yield call(API.get(config(currentCsrfToken)), '/account/beneficiaries');
        yield put(beneficiariesData(beneficiaries));
    } catch (error) {
        yield put(beneficiariesError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
