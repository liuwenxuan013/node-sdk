const functions = require('firebase-functions');
const {
 Address,
 CreditCardData,
 ServicesConfig,
 ServicesContainer,
} = require('globalpayments-api');


exports.preAuthorizePayment = functions.https.onCall(async (body, context) => {
 const configure = () => {
  const config = new ServicesConfig();
  config.secretApiKey = 'skapi_cert_MYl2AQAowiQAbLp5JesGKh7QFkcizOP2jcX9BrEMqQ';
  config.serviceUrl = 'https://cert.api2-c.heartlandportico.com';

  // The following variables will be provided to your during certification.
  config.versionNumber = '0000';
  config.developerId = '000000';

  ServicesContainer.configure(config);
 }
 configure();

 const card = new CreditCardData();
 card.token = body.paymentReference;


 const authorization = await card.authorize('120.00')
   .withCurrency('USD')
   .execute();

console.log(`Transaction ID:   ${authorization.transactionId}`);
console.log(`Response Code:    ${authorization.responseCode}`);
console.log(`Response Message: ${authorization.responseMessage}`);

// You are saving this data for future procession. This contins all the info about cart items and payment, etc.
//  database.write({
//   cart,
//   payment
//  })

 // In this case I am sending payment obj back to frontend to emulate a new call coming from picker\elsewhom
 // who ensures that items are ready to be shipped and now have been weighted
 // Looks like this:
 //
 // {data: {…}}
 // data:
 //   card:
 //     cardPresent: false
 // cvnPresenceIndicator: 4
 // paymentMethodType: 2
 // readerPresent: false
 // token: "supt_xhsiYTntxPcP2QSu94qOEbYj"
 // __proto__: Object
 // payment:
 //   authorizedAmount: null
 // availableBalance: null
 // avsResponseCode: "0"
 // avsResponseMessage: "AVS Not Requested."
 // balanceAmount: null
 // cardBrandTransactionId: "000294019750207"
 // cardLast4: null
 // cardType: "Visa"
 // cavvResponseCode: null
 // commercialIndicator: null
 // cvnResponseCode: null
 // cvnResponseMessage: null
 // pointsBalanceAmount: null
 // recurringDataCode: null
 // referenceNumber: "029310471303"
 // responseCode: "00"
 // responseMessage: "APPROVAL"
 // transactionDescriptor: null
 // transactionReference:
 //   authCode: "28593A"
 // paymentMethodType: 2
 // transactionId: "1338801877"
 // __proto__: Object
 // __proto__: Object
 // __proto__: Object
 // __proto__: Object
 return {card, authorization}
})
exports.capture = functions.https.onCall(async (body, context) => {
 const configure = () => {
  const config = new ServicesConfig();
  config.secretApiKey = 'skapi_cert_MYl2AQAowiQAbLp5JesGKh7QFkcizOP2jcX9BrEMqQ';
  config.serviceUrl = 'https://cert.api2-c.heartlandportico.com';

  // The following variables will be provided to your during certification.
  config.versionNumber = '0000';
  config.developerId = '000000';

  ServicesContainer.configure(config);
 }
 configure();
console.log(body);
  // having received retrieved order (from db)
 const card = new CreditCardData();
 card.token = body.card.token; // this does not go through on the sandbox since GP does not save any sandboxed's authorizations.

 //
 const payment = await card.charge(body.price)
   .withCurrency('USD')
   .execute();
 //
 // console.log(`Transaction ID:   ${payment.transactionId}`);
 // console.log(`Response Code:    ${payment.responseCode}`);
 // console.log(`Response Message: ${payment.responseMessage}`);


 return 'Good business';
})
