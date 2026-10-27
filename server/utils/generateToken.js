import jwt from 'jsonwebtoken';

export const generateToken = (id, role = 'farmer') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'agritech_secret_fallback', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};
