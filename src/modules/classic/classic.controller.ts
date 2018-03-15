import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import * as PayPal from "paypal-nvp-api";
import * as querystring from "querystring";

const config = {
  mode: process.env.PAYPAL_ENVIRONMENT ? process.env.PAYPAL_ENVIRONMENT : 'sandbox',
  username: process.env.PAYPAL_CLASSIC_USER,
  password: process.env.PAYPAL_CLASSIC_PASSWORD,
  signature: process.env.PAYPAL_CLASSIC_SIGNATURE,
}

@Controller('classic')
export class ClassicController {
  private _paypal: any;
  constructor() {
    this._paypal = PayPal(config);
  }

  @Get()
  root(@Res() res) {
    res.render('cart');
  }

  @Get('payment')
  payment(@Res() res) {
    res.render('payment');
  }

  @Post('payment')
  paymentHandler(@Req() req, @Res() res) {
    if (req.body.paymentMethod === "paypal") {
      return this.setExpressCheckoutRedirect(req, res);
    } else {
      throw new Error('Payment Method not enabled');
    }
    
  }

 @Get('cancelurl')
 cancel(@Res() res) {
    res.render('cancel');
 }

  @Get('confirmation')
  async confirmation(@Req() req, @Res() res) {
    const getec = await this.getExpressCheckout(req.query.token, req.query.payerid);
    res.render('confirmation', getec);
  }
  /*
  @Post('api/getexpresscheckout') 
  getExpressCheckoutApi(@Req() req) {
    return this.getExpressCheckout(req.body.token, req.body.payerid);
  }
  */
  getExpressCheckout(token, payerid) {
    return this._paypal.request('GetExpressCheckoutDetails', {
      TOKEN: token,
      PAYERID: payerid,
    });
  }

  /*
  @Post('api/setexpresscheckout')
  setExpressCheckoutApi(@Req() req, @Res() res) {
    return this.setExpressCheckout(req.body.amount, req.body.currency, req.body.action);
  }
  */

  setExpressCheckout(amount, currency, action) {
    return this._paypal.request('SetExpressCheckout', {
      'PAYMENTREQUEST_0_AMT': amount || 50,
      'PAYMENTREQUEST_0_CURRENCYCODE': currency || "USD",
      'PAYMENTREQUEST_0_PAYMENTACTION': action || "SALE",
      'RETURNURL': 'http://localhost:3000/classic/confirmation',
      'CANCELURL': 'http://localhost:3000/classic/cancelurl'
    });
  }

  @Post('setexpresscheckout')
  async setExpressCheckoutRedirect(@Req() req, @Res() res) {
    const response = await this.setExpressCheckout(req.body.amount, req.body.currency, req.body.action);
    res.json(response);
    // res.redirect(`https://www.${config.mode === "sandbox" ? "sandbox.paypal" : "paypal"}.com/checkoutnow?token=${response.TOKEN}`);
  }

  @Post('doexpresscheckout')
  async doExpressCheckoutRoute(@Req() req, @Res() res) {
    const response = await this.doExpressCheckout(req.body.amount, req.body.token, req.body.payerid);
    res.redirect(`/classic/done?${querystring.stringify(response)}`);
  }

  doExpressCheckout(AMT, TOKEN, PAYERID, PAYMENTACTION = "Sale") {
    return this._paypal.request('DoExpressCheckoutPayment', {
      AMT,
      TOKEN,
      PAYERID,
      PAYMENTACTION
    })
  }

  @Get('done')
  async done(@Req() req, @Res() res) {
    res.render('done', req.query);
  }
}
