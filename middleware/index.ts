import * as samlify from 'samlify';
import * as fs from 'fs';
import * as validator from '@authenio/samlify-node-xmllint';

const binding = samlify.Constants.namespace.binding;

samlify.setSchemaValidator(validator);


// configure EU LOGIN acceptance idp
const acceptanceIdp = samlify.IdentityProvider({
  metadata: fs.readFileSync(__dirname + '/../metadata/ecas-acceptance-ec-europa-eu.xml'),
  wantLogoutRequestSigned: true,
  wantAuthnRequestsSigned: true
});

const acceptanceIdpEnc = samlify.IdentityProvider({
  metadata: fs.readFileSync(__dirname + '/../metadata/ecas-acceptance-ec-europa-eu.xml'),
  isAssertionEncrypted: true,
  messageSigningOrder: 'encrypt-then-sign',
  wantLogoutRequestSigned: true,
  wantAuthnRequestsSigned: true
});


// configure our service provider ACC
const accSp = samlify.ServiceProvider({
  entityID: 'https://ppe.data.europa.eu/auth/saml',
  authnRequestsSigned: true,
  //authnRequestsSigned: acceptanceIdp.entityMeta.isWantAuthnRequestsSigned(),
  wantAssertionsSigned: true,
  wantMessageSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
  privateKey: fs.readFileSync(__dirname + '/../key/sign/privkey.pem'),
  privateKeyPass: 'VHOSp5RUiBcrsjrcAuXFwU1NKCkGA8px',
  isAssertionEncrypted: false,
  assertionConsumerService: [{
    Binding: binding.post,
    Location: 'https://ppe.data.europa.eu/auth/saml/acs',
  }]
});

// encrypted response ACC
const accSpEnc = samlify.ServiceProvider({
  entityID: 'https://ppe.data.europa.eu/auth/saml',
  authnRequestsSigned: true,
  // Adapt Sp to the Idp configuration
  // authnRequestsSigned: acceptanceIdp.entityMeta.isWantAuthnRequestsSigned(),
  wantAssertionsSigned: true,
  wantMessageSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
  privateKey: fs.readFileSync(__dirname + '/../key/sign/privkey.pem'),
  privateKeyPass: 'VHOSp5RUiBcrsjrcAuXFwU1NKCkGA8px',
  encPrivateKey: fs.readFileSync(__dirname + '/../key/encrypt/privkey.pem'),
  assertionConsumerService: [{
    Binding: binding.post,
    Location: 'https://ppe.data.europa.eu/auth/saml/acs',
  }]
});


export const assignEntity = (req, res, next) => {

  req.idp = acceptanceIdp;
  req.sp = accSp;

  if (req.query && req.query.encrypted) {
    req.idp = acceptanceIdpEnc;
    req.sp = accSpEnc;
  }

  return next();

};
