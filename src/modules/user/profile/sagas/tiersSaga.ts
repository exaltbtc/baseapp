// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    tiersData,
    tiersDisable,
    tiersError,
    TiersFetch,
} from '../actions';
import { getUserInfo } from '../index';

const tiersOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'applogic',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

export function* tiersSaga(action: TiersFetch) {
    try {
        const { uid, currency } = action.payload;
        const currentUserInfo = yield getUserInfo();
        const tier = yield call(API.get(tiersOptions(currentUserInfo && currentUserInfo.csrf_token)), `/tiers/${uid}?currency=${currency}`);
        yield put(tiersData(tier));
    } catch (error) {
        const tiersDisabled = error.code === 204;
        if (tiersDisabled) {
            yield put(tiersDisable());
        } else {
            yield put(tiersError(error));
        }
    }
}
