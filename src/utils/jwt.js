import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const signToken = (payload) => {
    return jwt.sign(payload, env.jwtAccessToken, {
        expiresIn: env.jwtAccessTtl
    })
}

export const verifyToken = (token) => {
    return jwt.verify(token, env.jwtAccessToken);
}