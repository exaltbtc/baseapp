// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../index';
import { generate2faQRData, generate2faQRError } from '../actions';
import { getUserInfo } from '../index';

const generate2faQROptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'barong',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};

interface GenerateQRResponse {
    data: {
        barcode: string;
        url: string;
    };
}

export function* generate2faQRSaga() {
    try {
        const currentUserInfo = yield getUserInfo();
        const qrData: GenerateQRResponse = yield call(API.post(generate2faQROptions(currentUserInfo && currentUserInfo.csrf_token)), '/resource/otp/generate_qrcode');
        const { barcode, url } = qrData.data;
        yield put(generate2faQRData({ barcode, url }));
    } catch (error) {
        yield put(generate2faQRError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
