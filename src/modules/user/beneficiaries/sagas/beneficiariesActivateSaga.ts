// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getUserInfo } from '../../../index';
import {
    BeneficiariesActivate,
    beneficiariesActivateData,
    beneficiariesActivateError,
} from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* beneficiariesActivateSaga(action: BeneficiariesActivate) {
    try {
        const { id } = action.payload;
        const currentUserInfo = yield getUserInfo();
        const payload = yield call(API.patch(config(currentUserInfo && currentUserInfo.csrf_token)), `/account/beneficiaries/${id}/activate`, action.payload);
        yield put(beneficiariesActivateData(payload));
        yield put(alertPush({message: ['success.beneficiaries.activated'], type: 'success'}));
    } catch (error) {
        yield put(beneficiariesActivateError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
