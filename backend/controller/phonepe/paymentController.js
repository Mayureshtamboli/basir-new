import crypto from 'crypto';
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const salt_key = process.env.SALT_KEY;
const merchant_id = process.env.MERCHANT_ID;
const BASE_URL =process.env.BASE_URL;

const newPayment = async (req, res) => {
    try {
        console.log("New payment request received"); // Add this line for logging
        const merchantTransactionId = req.body.transactionId;
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: req.body.MUID,
            name: req.body.name,
            amount: req.body.amount * 100,
            redirectUrl: `${BASE_URL}/api/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: req.body.number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay";
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
            return res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
        }).catch(function (error) {
            console.error(error);
        });

    } catch (error) {
        console.error("Error in newPayment:", error); // Add this line for logging errors
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};

const checkStatus = async (req, res) => {
    console.log("Check status request received"); // Add this line for logging
    const merchantTransactionId = res.req.body.transactionId;
    const merchantId = res.req.body.merchantId;

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
        method: 'GET',
        url: `https://api-preprod.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    };

    // CHECK PAYMENT STATUS
    axios.request(options).then(async (response) => {
        if (response.data.success === true) {
            const url = `http://localhost:3000/success`;
            return res.redirect(url);
        } else {
            const url = `http://localhost:3000/failure`;
            return res.redirect(url);
        }
    }).catch((error) => {
        console.error("Error in checkStatus:", error); // Add this line for logging errors
        console.error(error);
    });
};

export { newPayment, checkStatus };
