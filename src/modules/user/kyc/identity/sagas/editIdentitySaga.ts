// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush, getUserInfo } from '../../../../index';
import { editIdentityData, editIdentityError, EditIdentityFetch } from '../actions';

const sessionsConfig = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* editIdentitySaga(action: EditIdentityFetch) {
    try {
        const currentUserInfo = yield getUserInfo();
        const response = yield call(API.put(sessionsConfig(currentUserInfo && currentUserInfo.csrf_token)), '/resource/profiles', action.payload);
        const defaultMessage = 'success.identity.accepted';
        const { message = defaultMessage } = response;
        yield put(editIdentityData({ message }));
        yield put(alertPush({message: [defaultMessage], type: 'success'}));
    } catch (error) {
        yield put(editIdentityError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
