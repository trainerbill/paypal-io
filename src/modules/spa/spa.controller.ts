import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import * as paypal from "paypal-rest-sdk";
import * as querystring from "querystring";



@Controller('spa')
export class SpaController {
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
    res.render('spa');
  }

  @Post('validate')
  async validate(@Body() body, @Res() res) {
    // You need to get this from your server
    const cartTotalFromServer = '0.01';
    const request = new this._payments.PaymentGetRequest(body.payid);
    const response = await this._client.execute(request);
    return response.result.transactions[0].amount.total === cartTotalFromServer ? res.json({ valid: true }) : res.json({ valid: false });
  }
}
