// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getUserInfo } from '../../../index';
import {
    walletsAddressData,
    walletsAddressError,
    WalletsAddressFetch,
} from '../actions';

const walletsAddressOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* walletsAddressSaga(action: WalletsAddressFetch) {
    try {
        const currentUserInfo = yield getUserInfo();
        const currency = action.payload.currency.toLocaleLowerCase();
        const url = `/account/deposit_address/${currency}`;
        const { address } = yield call(API.get(walletsAddressOptions(currentUserInfo && currentUserInfo.csrf_token)), url);
        yield put(walletsAddressData({
            address,
            currency,
        }));
    } catch (error) {
        yield put(walletsAddressError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
