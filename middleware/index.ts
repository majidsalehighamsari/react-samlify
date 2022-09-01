import * as samlify from 'samlify';
import * as fs from 'fs';
import * as validator from '@authenio/samlify-node-xmllint';

const binding = samlify.Constants.namespace.binding;

samlify.setSchemaValidator(validator);


// configure jumpcloud idp
const jumpCloudIdp = samlify.IdentityProvider({
  metadata: fs.readFileSync(__dirname + '/../metadata/JumpCloud-saml2-metadata.xml'),
  wantLogoutRequestSigned: true
});


const jumpcloudIdpEnc = samlify.IdentityProvider({
  metadata: fs.readFileSync(__dirname + '/../metadata/JumpCloud-saml2-metadata.xml'),
  isAssertionEncrypted: true,
  messageSigningOrder: 'encrypt-then-sign',
  wantLogoutRequestSigned: true,
});



// configure our service provider (your application 2)
const sp2 = samlify.ServiceProvider({
  entityID: 'http://localhost:8080/metadata',
  authnRequestsSigned: true,
  wantAssertionsSigned: true,
  wantMessageSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
  privateKey: fs.readFileSync(__dirname + '/../key/sign/privkey.pem'),
  privateKeyPass: 'VHOSp5RUiBcrsjrcAuXFwU1NKCkGA8px',
  isAssertionEncrypted: false,
  assertionConsumerService: [{
    Binding: binding.post,
    Location: 'http://localhost:8080/sp/acs',
  }]
});

// encrypted response
const sp2Enc = samlify.ServiceProvider({
  entityID: 'http://localhost:8080/metadata?encrypted=true',
  authnRequestsSigned: true,
  wantAssertionsSigned: true,
  wantMessageSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
  privateKey: fs.readFileSync(__dirname + '/../key/sign/privkey.pem'),
  privateKeyPass: 'VHOSp5RUiBcrsjrcAuXFwU1NKCkGA8px',
  encPrivateKey: fs.readFileSync(__dirname + '/../key/encrypt/privkey.pem'),
  assertionConsumerService: [{
    Binding: binding.post,
    Location: 'http://localhost:8080/sp/acs?encrypted=true',
  }]
});


export const assignEntity = (req, res, next) => {

  req.idp = jumpCloudIdp;
  req.sp = sp2;

  if (req.query && req.query.encrypted) {
    req.idp = jumpcloudIdpEnc;
    req.sp = sp2Enc;
  }

  return next();

};
