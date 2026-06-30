// iyzico payment integration
// Docs: https://dev.iyzipay.com

export interface IyzicoPaymentRequest {
  price: string;         // "420.00"
  paidPrice: string;     // total including fees
  currency: string;      // "USD" or "TRY"
  basketId: string;      // booking PNR
  callbackUrl: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    identityNumber: string;  // "11111111111" for test
    registrationAddress: string;
    city: string;
    country: string;
    gsmNumber: string;
  };
  shippingAddress: { contactName: string; city: string; country: string; address: string };
  billingAddress:  { contactName: string; city: string; country: string; address: string };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    itemType: "VIRTUAL";
    price: string;
  }>;
}

export async function initIyzicoCheckout(req: IyzicoPaymentRequest) {
  const Iyzipay = require("iyzipay");

  const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com",
  });

  return new Promise<{ status: string; token?: string; checkoutFormContent?: string; errorMessage?: string }>(
    (resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(req, (err: Error, result: { status: string; token?: string; checkoutFormContent?: string; errorMessage?: string }) => {
        if (err) return reject(err);
        resolve(result);
      });
    }
  );
}

export async function retrieveIyzicoCheckout(token: string) {
  const Iyzipay = require("iyzipay");

  const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL ?? "https://sandbox-api.iyzipay.com",
  });

  return new Promise<Record<string, string>>((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({ token }, (err: Error, result: Record<string, string>) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
