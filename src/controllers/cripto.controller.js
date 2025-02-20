import tronWeb from "../utils/tronWeb.js";

import { asyncHandler } from "../utils/asyncHandler.js";

export const getBalance = asyncHandler(async (req, res) => {
  const { walletAddress } = req.body;
  try {
    const balance = await tronWeb.trx.getBalance(walletAddress);
    const humanReadableBalance = tronWeb.fromSun(balance);
    res.json({ balance: humanReadableBalance });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

export const sendTRX = asyncHandler(async (req, res) => {
  const { senderAddress, receiverAddress, amount } = req.body;

  try {
    // Convert the amount from TRX to SUN
    const amountInSun = tronWeb.toSun(amount);

    // Build the transaction
    const transaction = await tronWeb.transactionBuilder.sendTrx(
      receiverAddress,
      amountInSun,
      senderAddress
    );

    // Sign the transaction with the private key
    const signedTransaction = await tronWeb.trx.sign(
      transaction,
      process.env.CRIPTO_PRIVATE
    );

    // Broadcast the transaction to the TRON network
    const broadcast = await tronWeb.trx.sendRawTransaction(signedTransaction);
    res.json({ success: true, transactionHash: broadcast.txid });
  } catch (error) {
    console.error("Error sending TRX:", error);
    res.status(500).json({ error: "Failed to send TRX" });
  }
});
