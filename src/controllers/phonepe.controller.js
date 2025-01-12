import axios from'axios';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
// const API_KEY = '944a13ea-89fe-47e2-bb9c-34bce182cdf1'; // Replace with your actual API key
// const MERCHANT_KEY = 'M22CA7BWH4KS2';
// export paymemtInitiate = asyncHandler(async (req, res) => {
//   const { transactionId, status } = req.body;   

// export const initiatePayment = async () => {
//  const orderId = uuidv4(); 

//     try {
//         const response = await axios.post(
//             'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', // Replace with actual endpoint
//             {
//                 merchantId: MERCHANT_KEY,
//                 amount: 50000, 
//                 callbackUrl: 'http://localhost:4001/payment/callback',
//                 transactionId: orderId,
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${API_KEY}`, // Add the API key in the Authorization header
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         console.log('Payment Initiated:', response.data);
//     } catch (err) {
//         console.error('Error initiating payment:', err.response?.data || err.message);
//     }
// };

// Utility function to verify signature
// const verifySignature = (payload, receivedSignature) => {
//     const calculatedSignature = crypto
//         .createHmac('sha256', MERCHANT_KEY)
//         .update(JSON.stringify(payload))
//         .digest('base64');

//     return calculatedSignature === receivedSignature;
// };

// Payment Callback Endpoint
// export const paymentCallback = async (req, res) => {
//     const payload = req.body;
//     const signature = req.headers['x-verify'];

//     console.log('Payment Callback Received:', payload);

//     // Step 1: Verify the signature
//     if (!verifySignature(payload, signature)) {
//         console.error('Signature verification failed!');
//         return res.status(400).send({ message: 'Invalid signature' });
//     }

//     // Step 2: Process the payment details
//     const { transactionId, status, amount } = payload;

//     if (status === 'SUCCESS') {
//         console.log(`Payment successful for Transaction ID: ${transactionId}, Amount: ${amount}`);
//         // TODO: Update your database for the successful payment
//     } else if (status === 'FAILED') {
//         console.log(`Payment failed for Transaction ID: ${transactionId}`);
//         // TODO: Handle payment failure
//     } else {
//         console.log(`Payment status: ${status}`);
//         // Handle other statuses if required
//     }

//     // Step 3: Acknowledge the callback
//     return res.status(200).send({ message: 'Callback received successfully' });
// };

// Start the server


// const MERCHANT_KEY="96434309-7796-489d-8924-ab56988a6076"
// const MERCHANT_ID="PGTESTPAYUAT86"

// const MERCHANT_BASE_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
// const MERCHANT_STATUS_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status"

const MERCHANT_KEY="944a13ea-89fe-47e2-bb9c-34bce182cdf1"
const MERCHANT_ID="M22CA7BWH4KS2"
const MERCHANT_BASE_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
const MERCHANT_STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status"

const redirectUrl="https://api.indusdigicart.com/payment/callback"

const successUrl="https://indusdigicart.com/payment-success.php"
const failureUrl="https://indusdigicart.com/payment-failed.php"


export const initiatePayment= async (req, res) => {

    const {name, mobileNumber, amount} = req.body;
    const orderId = uuidv4()
    //payment
    const paymentPayload = {
        merchantId : MERCHANT_ID,
        merchantUserId: name,
        mobileNumber: mobileNumber,
        amount : amount * 100,
        merchantTransactionId: orderId,
        redirectUrl: `${redirectUrl}/${orderId}`,
        redirectMode: 'GET',
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
        console.log("response++++++++++++", response)   
         res.status(200).json({msg : "OK", url: response.data.data.instrumentResponse.redirectInfo.url})
    } catch (error) {
        console.log("error in payment", error)
        res.status(500).json({error : 'Failed to initiate payment'})
    }

};

export const paymentCallback = async (req, res) => {
    const merchantTransactionId = req.query.id;
    console.log("merchantTransactionId", merchantTransactionId)

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
        console.log("response", response)
        if (response.data.success === true){
            return res.redirect(successUrl)
        }else{
            return res.redirect(failureUrl)
        }
    })
};



