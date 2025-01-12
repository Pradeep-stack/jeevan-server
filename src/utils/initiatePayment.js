// // Import the required modules
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import crypto from 'crypto';  // Importing the built-in 'crypto' module for generating signatures

// const phonepeAPI = 'https://api.phonepe.com/v1/';  // Replace with the actual PhonePe API URL

// // Function to generate the signature for PhonePe
// const generateSignature = (paymentData) => {
//   const { merchantKey, orderId, amount, userDetails, productDetails, callbackUrl } = paymentData;

//   // Create a string based on required fields for signature
//   const dataToSign = `${merchantKey}|${orderId}|${amount}|${callbackUrl}|${userDetails.mobile}|${userDetails.email}|${productDetails.productId}|${productDetails.quantity}`;
  
//   // Generate a hash using the merchantKey and data string
//   const signature = crypto.createHmac('sha256', merchantKey)
//     .update(dataToSign)
//     .digest('hex');
  
//   return signature;
// };

// // Function to create a payment order for PhonePe
// export const createPaymentOrder = async (amount, userDetails, productDetails) => {
//   const orderId = uuidv4();  // Generate a unique order ID
//   const paymentData = {
//     merchantId: 'YOUR_MERCHANT_ID',
//     merchantKey: 'YOUR_MERCHANT_KEY',
//     amount,
//     orderId,
//     callbackUrl: 'YOUR_CALLBACK_URL',
//     userDetails,
//     productDetails,
//     paymentMode: 'card',  // Assuming it's a card payment; adjust as needed
//     transactionDetails: {
//       transactionId: uuidv4(),
//       timestamp: Date.now()
//     },
//     signature: generateSignature(paymentData)  // Secure signature
//   };

//   try {
//     // Make the API call to PhonePe to create the payment order
//     const response = await axios.post(`${phonepeAPI}/payment/createOrder`, paymentData, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     // Check if the payment order creation was successful
//     if (response.data.status === 'success') {
//       return { success: true, paymentUrl: response.data.paymentUrl };  // URL to redirect the user for payment
//     } else {
//       return { success: false, message: 'Failed to create payment order' };
//     }
//   } catch (error) {
//     console.error('PhonePe API Error:', error);
//     return { success: false, message: error.message };
//   }
// };

import axios from 'axios';
import { generateSignature } from './Phonepe.js';  
import { v4 as uuidv4 } from 'uuid';

const phonepeAPI = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'; 

// Function to initiate the payment with PhonePe
export const initiatePayment = async (paymentPayload) => {
  const { amount, userId, name, email, mobile, productDetails, purchaseId } = paymentPayload;

  const orderId = uuidv4();  
  const callbackUrl = 'https://yourcallbackurl.com';  

  // Prepare data to send to PhonePe
  const paymentData = {
    merchantId: 'YOUR_MERCHANT_ID', 
    merchantKey: 'YOUR_MERCHANT_KEY',  
    amount,
    orderId,
    callbackUrl,
    userDetails: { name, email, mobile },
    productDetails: { productId: productDetails.productId, quantity: productDetails.quantity }
  };

  // Generate the signature
  paymentData.signature = generateSignature(paymentData);

  try {
    // Send the payment data to PhonePe API to create the payment order
    const response = await axios.post(`${phonepeAPI}`, paymentData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check if the payment order was created successfully
    if (response.data.status === 'success') {
      return { success: true, paymentUrl: response.data.paymentUrl };  // Return the payment URL for redirect
    } else {
      return { success: false, message: 'Failed to create payment order' };
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    return { success: false, message: error.message };
  }
};
