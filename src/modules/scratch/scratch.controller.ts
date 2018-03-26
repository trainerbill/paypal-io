import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import * as paypal from "paypal-rest-sdk";
import * as querystring from "querystring";



@Controller('scratch')
export class ScratchController {
  private _client: any;
  private _payments: any;
  constructor() {
        this._payments = paypal.v1.payments;
        const env = new paypal.core.SandboxEnvironment(
          'ARkR7soWd2kUxFCNPHOmyb3IQhOwiL-wYhRmsRRD1SdslE0u-lCEps4LdN_KocpyEPgaWJXcsFuwd99M',
          'ECSQrtNCk09UyKoHfSWuogfaQRmjbgVy9Mg7nc6JOI48z_dMfNonz-3Z3KFCLeX5qhFLGJ9e--DY59gV'
        );
        this._client = new paypal.core.PayPalHttpClient(env);
      }

  @Get()
  root(@Res() res) {
    res.render('scratch-cart');
  }

  @Get('payment')
  payment(@Res() res) {
    res.render('scratch-payment');
  }

  @Get('cancelurl')
  cancel(@Res() res) {
      res.render('cancel');
  }

  @Get('confirmation')
  async confirmation(@Req() req, @Res() res) {
    try {
      const payment = await this.getPayment(req.query.paymentId);
      res.render('scratch-confirmation', {
        order: {
          amount: payment.result.transactions[0].amount.total,
          currency: payment.result.transactions[0].amount.currency,
          token: payment.result.id,
          payerid: payment.result.payer.payer_info.payer_id,
          action: 'Sale'
        },
        account: { 
            email: payment.result.payer.payer_info.email,
            phone: payment.result.payer.payer_info.phone,
            status: payment.result.payer.status,
            fname: payment.result.payer.payer_info.first_name,
            lname: payment.result.payer.payer_info.last_name,
        },
        shipping: {
          name: payment.result.transactions[0].item_list.shipping_address.recipient_name,
          street: payment.result.transactions[0].item_list.shipping_address.line1,
          city: payment.result.transactions[0].item_list.shipping_address.city,
          state: payment.result.transactions[0].item_list.shipping_address.state,
          postal: payment.result.transactions[0].item_list.shipping_address.postal_code,
          country: payment.result.transactions[0].item_list.shipping_address.country_code,
        }
      });
    } catch(err) {
      res.error(err);
    }
    
    
  }
  
  getPayment(payId) {
    const request = new this._payments.PaymentGetRequest(payId);
    return this._client.execute(request);
  }

  @Post('execute')
  async executePayment(@Body() body, @Res() res) {
    try {
      // You need to get this from your server
      const cartTotalFromServer = '0.01';
      const getRequest = new this._payments.PaymentGetRequest(body.payid);
      const payment = await this._client.execute(getRequest);
      if (payment.result.transactions[0].amount.total !== cartTotalFromServer) {
        throw new Error('Cart total and paypal total do not match.');
      }
      const request = new this._payments.PaymentExecuteRequest(body.payid);
      request.requestBody({
        payer_id: body.payerid
      });
      const response = await this._client.execute(request); 
      res.render('done', {
        transaction: {
          id: response.result.transactions[0].related_resources[0].sale.id,
          amount: response.result.transactions[0].related_resources[0].sale.amount.total,
          status: response.result.transactions[0].related_resources[0].sale.state,
          timestamp: response.result.transactions[0].related_resources[0].sale.create_time,
        }
      });
    } catch (err) {
      res.error(err);
    }
  }
}
