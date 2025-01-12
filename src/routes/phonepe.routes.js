import express from "express";
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 }  from 'uuid';
// import {paymentCallback, initiatePayment} from "../controllers/phonepe.controller.js";

const router = express.Router();

// router.get("/callback/:id", paymentCallback);
// router.post("/initiate", initiatePayment);








// const MERCHANT_KEY="944a13ea-89fe-47e2-bb9c-34bce182cdf1"
// const MERCHANT_ID="M22CA7BWH4KS2"
const MERCHANT_KEY="96434309-7796-489d-8924-ab56988a6076"
const MERCHANT_ID="PGTESTPAYUAT86"

// const MERCHANT_BASE_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
// const MERCHANT_STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status"

const MERCHANT_BASE_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
const MERCHANT_STATUS_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status"

const redirectUrl="https://api.indusdigicart.com/payment/status"
// const redirectUrl="https://api.indusdigicart.com/payment/status"
// const successUrl="https://indusdigicart.com/payment-success.php"
// const failureUrl="https://indusdigicart.com/payment-failed.php"
// const redirectUrl="http://localhost:4001/payment/status"
const successUrl="https://indusdigicart.com/payment-success.php"
const failureUrl="https://indusdigicart.com/payment-failed.php"

// https://phonepe-kek2.onrender.com/create-order
router.post('/create-order', async (req, res) => {

    const {name, mobileNumber, amount} = req.body;
    const orderId = `order_${Date.now()}`;

    //payment
    const paymentPayload = {
        merchantId : MERCHANT_ID,
        merchantUserId: name,
        mobileNumber: mobileNumber,
        amount : amount * 100,
        merchantTransactionId: orderId,
        redirectUrl: `${redirectUrl}/?id=${orderId}`,
        redirectMode: 'POST',
        paymentInstrument: {
            type: 'PAY_PAGE'
        }
    }

    const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64')
    const keyIndex = 1
    const string  = payload + '/pg/v1/pay' + MERCHANT_KEY
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')
    const checksum = sha256 + '###' + keyIndex

    const option = {
        method: 'POST',
        url:MERCHANT_BASE_URL,
        headers: {
            accept : 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
        },
        data :{
            request : payload
        }
    }
    try {
        
        const response = await axios.request(option);
        console.log(response.data.data.instrumentResponse.redirectInfo.url)
         res.status(200).json({msg : "OK", url: response.data.data.instrumentResponse.redirectInfo.url})
    } catch (error) {
        console.log("error in payment", error)
        res.status(500).json({error : 'Failed to initiate payment'})
    }

});


router.post('/status', async (req, res) => {
    const merchantTransactionId = req.query.id;

    const keyIndex = 1
    const string  = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')
    const checksum = sha256 + '###' + keyIndex

    const option = {
        method: 'GET',
        url:`${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
        headers: {
            accept : 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': MERCHANT_ID
        },
    }

    axios.request(option).then((response) => {
        if (response.data.success === true){
            return res.redirect(successUrl)
        }else{
            return res.redirect(failureUrl)
        }
    })
});


export default router;