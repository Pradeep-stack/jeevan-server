import crypto from 'crypto';

// Your merchant details
const merchantKey = 'PGTESTPAYUAT';  // Replace with your merchant key

// Function to generate the signature required by PhonePe
export const generateSignature = (paymentData) => {
  const { merchantKey, orderId, amount, userDetails, productDetails, callbackUrl } = paymentData;

  // Prepare the data string as per the PhonePe API documentation
  const dataString = `${merchantKey}|${orderId}|${amount}|${userDetails.mobile}|${userDetails.email}|${userDetails.name}|${productDetails.productId}|${productDetails.quantity}|${callbackUrl}`;

  // Create a hash using SHA-256 algorithm and the merchant key
  const hash = crypto.createHmac('sha256', merchantKey)
                     .update(dataString)
                     .digest('hex'); // This generates the hash signature

  return hash;
};
