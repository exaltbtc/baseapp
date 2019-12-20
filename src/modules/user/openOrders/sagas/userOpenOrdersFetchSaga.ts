// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getUserInfo } from '../../../index';
import {
    userOpenOrdersData,
    userOpenOrdersError,
    UserOpenOrdersFetch,
} from '../actions';

const ordersOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* userOpenOrdersFetchSaga(action: UserOpenOrdersFetch) {
    try {
        const { market } = action.payload;
        const currentUserInfo = yield getUserInfo();
        const list = yield call(API.get(ordersOptions(currentUserInfo && currentUserInfo.csrf_token)), `/market/orders?market=${market.id}&state=wait`);

        yield put(userOpenOrdersData(list));
    } catch (error) {
        yield put(userOpenOrdersError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
