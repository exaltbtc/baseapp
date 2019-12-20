// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getUserInfo } from '../../../index';
import { convertOrderAPI } from '../../openOrders/helpers';
import {
    userOrdersHistoryData,
    userOrdersHistoryError,
    UserOrdersHistoryFetch,
} from '../actions';

const ordersOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        withHeaders: true,
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* ordersHistorySaga(action: UserOrdersHistoryFetch) {
    try {
        const currentUserInfo = yield getUserInfo();
        const { pageIndex, limit, type } = action.payload;
        const params = `limit=${limit}&page=${pageIndex + 1}${type === 'all' ? '' : '&state=wait'}`;
        const { data, headers } = yield call(API.get(ordersOptions(currentUserInfo && currentUserInfo.csrf_token)), `/market/orders?${params}`);

        const list = data.map(convertOrderAPI);

        yield put(userOrdersHistoryData({ list, pageIndex, total: headers.total }));
    } catch (error) {
        yield put(userOrdersHistoryError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
