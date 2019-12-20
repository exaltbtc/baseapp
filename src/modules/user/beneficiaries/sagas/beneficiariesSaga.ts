// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getUserInfo } from '../../../index';
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
        const currentUserInfo = yield getUserInfo();
        const beneficiaries = yield call(API.get(config(currentUserInfo && currentUserInfo.csrf_token)), '/account/beneficiaries');
        yield put(beneficiariesData(beneficiaries));
    } catch (error) {
        yield put(beneficiariesError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
