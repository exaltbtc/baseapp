// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, defaultStorageLimit, RequestOptions } from '../../../../api';
import { getHistorySagaParam } from '../../../../helpers';
import { alertPush, getUserInfo } from '../../../index';
import { failHistory, HistoryFetch, successHistory } from '../actions';

const config = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        withHeaders: true,
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* historySaga(action: HistoryFetch) {
    try {
        const { type, page } = action.payload;
        const coreEndpoint = {
            deposits: '/account/deposits',
            withdraws: '/account/withdraws',
            trades: '/market/trades',
        };
        const params = getHistorySagaParam(action.payload);
        const currentUserInfo = yield getUserInfo();
        const { data, headers } = yield call(API.get(config(currentUserInfo && currentUserInfo.csrf_token)), `${coreEndpoint[type]}?${params}`);
        let updatedData = data;
        if (type === 'trades') {
            updatedData = data.slice(0, defaultStorageLimit());
        }

        yield put(successHistory({ list: updatedData, page, fullHistory: headers.total }));
    } catch (error) {
        yield put(failHistory([]));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
