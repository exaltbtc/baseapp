// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush, getUserInfo } from '../../../index';
import { walletsData, walletsError } from '../actions';

const walletsOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

const currenciesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* walletsSaga() {
    try {
        const currentUserInfo = yield getUserInfo();
        const accounts = yield call(API.get(walletsOptions(currentUserInfo && currentUserInfo.csrf_token)), '/account/balances');
        const currencies = yield call(API.get(currenciesOptions), '/public/currencies');

        const accountsByCurrencies = currencies.map(currency => {
            let walletInfo = accounts.find(wallet => wallet.currency === currency.id);

            if (!walletInfo) {
                walletInfo = {
                    balance: 0,
                    currency: currency.id,
                    locked: 0,
                };
            }

            return ({
                ...walletInfo,
                name: currency.name,
                explorerTransaction: currency!.explorer_transaction,
                explorerAddress: currency!.explorer_address,
                fee: currency!.withdraw_fee,
                type: currency!.type,
                fixed: currency!.precision,
                iconUrl: currency.icon_url,
            });
        });

        yield put(walletsData(accountsByCurrencies));
    } catch (error) {
        yield put(walletsError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
