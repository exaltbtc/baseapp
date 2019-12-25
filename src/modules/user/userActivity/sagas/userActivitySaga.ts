// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../index';
import {
    userActivityData,
    userActivityError,
    UserActivityFetch,
} from '../actions';

const userActivityOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        withHeaders: true,
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* userActivitySaga(action: UserActivityFetch) {
    try {
        const { page, limit } = action.payload;
        const currentCsrfToken = yield getCsrfToken();
        const { data, headers } = yield call(API.get(userActivityOptions(currentCsrfToken)), `/resource/users/activity/all?limit=${limit}&page=${page + 1}`);
        yield put(userActivityData({ list: data, page, total: headers.total }));
    } catch (error) {
        yield put(userActivityError(error));
    }
}
