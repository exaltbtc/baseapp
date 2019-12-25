// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    profileIdentityData,
    profileIdentityError,
} from '../actions';
import { getCsrfToken } from '../index';

const userOptions = (csrfToken?: string): RequestOptions => (
    csrfToken ? {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    } : {
        apiVersion: 'barong',
    });

export function* profileIdentitySaga() {
    try {
        const currentCsrfToken = yield getCsrfToken();
        const profilePhone = yield call(API.get(userOptions(currentCsrfToken)), '/resource/phones');
        const profileIdentity = yield call(API.get(userOptions(currentCsrfToken)), '/resource/profiles/me');
        profileIdentity.number = profilePhone.filter(w => w.validated_at)[0].number;
        yield put(profileIdentityData(profileIdentity));
    } catch (error) {
        yield put(profileIdentityError(error));
    }
}
