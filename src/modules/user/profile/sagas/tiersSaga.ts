// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    tiersData,
    tiersDisable,
    tiersError,
    TiersFetch,
} from '../actions';
import { getCsrfToken } from '../index';

const tiersOptions = (csrfToken?: string): RequestOptions => (
    csrfToken ? {
        apiVersion: 'applogic',
        headers: { 'X-CSRF-Token': csrfToken },
    } : {
        apiVersion: 'applogic',
    });

export function* tiersSaga(action: TiersFetch) {
    try {
        const { uid, currency } = action.payload;
        const currentCsrfToken = yield getCsrfToken();
        const tier = yield call(API.get(tiersOptions(currentCsrfToken)), `/tiers/${uid}?currency=${currency}`);
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
