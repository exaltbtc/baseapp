// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import { convertOrderAPI } from '../../openOrders/helpers';
import {
    userOrdersHistoryData,
    userOrdersHistoryError,
    UserOrdersHistoryFetch,
} from '../actions';

const ordersOptions = (csrfToken?: string): RequestOptions => (
    csrfToken ? {
        apiVersion: 'peatio',
        withHeaders: true,
        headers: { 'X-CSRF-Token': csrfToken },
    } : {
        apiVersion: 'peatio',
        withHeaders: true,
    });

export function* ordersHistorySaga(action: UserOrdersHistoryFetch) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        const { pageIndex, limit, type } = action.payload;
        const params = `limit=${limit}&page=${pageIndex + 1}${type === 'all' ? '' : '&state=wait'}`;
        const { data, headers } = yield call(API.get(ordersOptions(currentCsrfToken)), `/market/orders?${params}`);

        const list = data.map(convertOrderAPI);

        yield put(userOrdersHistoryData({ list, pageIndex, total: headers.total }));
    } catch (error) {
        yield put(userOrdersHistoryError());
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
