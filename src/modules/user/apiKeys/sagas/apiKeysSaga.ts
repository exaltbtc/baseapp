// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getUserInfo } from '../../../index';
import { apiKeys2FAModal, apiKeysData, ApiKeysFetch } from '../actions';

const apiKeysOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* apiKeysSaga(action: ApiKeysFetch) {
    try {
        const currentUserInfo = yield getUserInfo();
        const apiKeys = yield call(API.get(apiKeysOptions(currentUserInfo && currentUserInfo.csrf_token)), '/resource/api_keys');
        yield put(apiKeysData(apiKeys));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    } finally {
        yield put(apiKeys2FAModal({active: false}));
    }
}
