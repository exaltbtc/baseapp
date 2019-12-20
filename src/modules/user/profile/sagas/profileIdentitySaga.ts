// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    profileIdentityData,
    profileIdentityError,
} from '../actions';
import { getUserInfo } from '../index';

const userOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* profileIdentitySaga() {
    try {
        const currentUserInfo = yield getUserInfo();
        const profilePhone = yield call(API.get(userOptions(currentUserInfo && currentUserInfo.csrf_token)), '/resource/phones');
        const profileIdentity = yield call(API.get(userOptions(currentUserInfo && currentUserInfo.csrf_token)), '/resource/profiles/me');
        profileIdentity.number = profilePhone.filter(w => w.validated_at)[0].number;
        yield put(profileIdentityData(profileIdentity));
    } catch (error) {
        yield put(profileIdentityError(error));
    }
}
