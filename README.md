# react-samlify

Fork from https://github.com/authenio/react-samlify

**Disclaimer: This repository provide a minimal implementation for SAML based login with EU LOGIN identity provider.

## Development

```console
yarn
yarn run dev
```

## Credential for EU LOGIN  acceptance Login

```
You need to register https://ecas.acceptance.ec.europa.eu/cas/login
Use your own user id and password

```


## Features Completed

- [x] SP-init SSO, EU LOGIN  IDP with (redirect) binding (Encrypted/Signed/Encrypted + Sign)
- [x] SP-init SLO, EU LOGIN IDP with (redirect) binding

**Remarks: If SP-initiate SSO works, IDP initiate SSO works as well.**

## Home screeen
Here's an image of a home in action:

![Home](./home.JPG)

After user login

![Login](./login.JPG)
