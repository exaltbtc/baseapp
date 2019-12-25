// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getCsrfToken } from '../../../index';
import {
    withdrawLimitData,
    withdrawLimitError,
    WithdrawLimitFetch,
} from '../actions';

const withdrawOption = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'applogic',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* withdrawLimitSaga(action: WithdrawLimitFetch) {
    try {
        const currentCsrfToken = yield getCsrfToken();
        const withdrawLimit = yield call(API.get(withdrawOption(currentCsrfToken)), '/private/withdraws');
        yield put(withdrawLimitData(withdrawLimit));
        yield put(alertPush({message: ['success.withdraw.action'], type: 'success'}));
    } catch (error) {
        yield put(withdrawLimitError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
