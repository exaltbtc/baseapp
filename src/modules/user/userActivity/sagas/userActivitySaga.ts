// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getUserInfo } from '../../../index';
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
        const currentUserInfo = yield getUserInfo();
        const { data, headers } = yield call(API.get(userActivityOptions(currentUserInfo && currentUserInfo.csrf_token)), `/resource/users/activity/all?limit=${limit}&page=${page + 1}`);
        yield put(userActivityData({ list: data, page, total: headers.total }));
    } catch (error) {
        yield put(userActivityError(error));
    }
}
