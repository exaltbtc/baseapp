// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import {
    walletsAddressData,
    walletsAddressError,
    WalletsAddressFetch,
} from '../actions';

const walletsAddressOptions = (csrfToken?: string): RequestOptions => (
    csrfToken ? {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    } : {
        apiVersion: 'peatio',
    });

export function* walletsAddressSaga(action: WalletsAddressFetch) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        const currency = action.payload.currency.toLocaleLowerCase();
        const url = `/account/deposit_address/${currency}`;
        const { address } = yield call(API.get(walletsAddressOptions(currentCsrfToken)), url);
        yield put(walletsAddressData({
            address,
            currency,
        }));
    } catch (error) {
        yield put(walletsAddressError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
