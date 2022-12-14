import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import { getUser, createToken, verifyToken } from './services/auth';
import { assignEntity } from './middleware';
import { Constants } from 'samlify';

export default function server(app) {

  app.use(bodyParser.urlencoded({ extended: false }));
  // for pretty print debugging
  app.set('json spaces', 2);
  // assign the session sp and idp based on the params
  app.use(assignEntity);

  // assertion consumer service endpoint (post-binding)
  app.post('/sp/acs', async (req, res) => {
    try {
      const { extract } = await req.sp.parseLoginResponse(req.idp, 'post', req);
      const { login } = extract.attributes;
      let payload = null;
      if (login != null) {
        console.log('login is NOT equal to null');
        // assign req user
        req.user = { nameId: login };
        payload = getUser(login);
      } else {
        console.log('extract get email');
        const { email } = extract.attributes;
        // get your system user
        console.log(email);
        payload = getUser(email);
        console.log('value is NOT equal to null');
      }

      if (payload) {
        // create session and redirect to the session page
        const token = createToken(payload);
        return res.redirect(`/?auth_token=${token}`);
      }
      throw new Error('ERR_USER_NOT_FOUND');
    } catch (e) {
      console.error('[FATAL] when parsing login response sent from okta', e);
      return res.redirect('/');
    }
  });

  // call to init a sso login with redirect binding
  app.get('/sso/redirect', async (req, res) => {
    const { id, context: redirectUrl } = await req.sp.createLoginRequest(req.idp, 'redirect');
    console.info('redirect redirectUrl:', redirectUrl);
    return res.redirect(redirectUrl);
  });


  // endpoint where consuming logout response
  app.post('/sp/sso/logout', async (req, res) => {
    const { extract } = await req.sp.parseLogoutResponse(req.idp, 'post', req);
    return res.redirect('/logout');
  });

  app.get('/sp/single_logout/redirect', async (req, res) => {
    const { context: redirectUrl } = await req.sp.createLogoutRequest(req.idp, 'redirect', { logoutNameID: 'demo@fokus.test' });
    console.info('single_logout redirectUrl:', redirectUrl);
    return res.redirect(redirectUrl);
  });



  // get user profile
  app.get('/profile', (req, res) => {
    try {
      const bearer = req.headers.authorization.replace('Bearer ', '');
      const { verified, payload } = verifyToken(bearer)
      if (verified) {
        return res.json({ profile: payload });
      }
      return res.send(401);
    } catch (e) {
      res.send(401);
    }
  });

}
