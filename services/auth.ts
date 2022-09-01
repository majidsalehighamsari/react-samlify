/**
 * Service Layer
 */
import * as jwt from 'jsonwebtoken';

const SECRET = 'VHOSp5RUiBcrsjrcAuXFwU1NKCkGA8px';

// this is a mock function, it should be used to interact with your database in real use case
export function getUser(login: string) {
  console.log(login);
  if (login === 'demo@fokus.test') {
    return {
      user_id: '8e92fdd4-01c9-42dc-b26d-b966db8adbb2',
      email: login
    };
  }


  return null;
}

export function createToken(payload) {
  return jwt.sign(payload, SECRET);
}

export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, SECRET);
    return { verified: true, payload: payload };
  } catch(err) {
    return { verified: false, payload: null };
  }
}
