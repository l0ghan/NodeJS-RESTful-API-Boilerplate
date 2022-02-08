// External module imports
const httpStatus = require('http-status');
const passport = require('passport');

// Internal module imports
const config = require('../config/config');
const { ErrorResponse } = require('../utils');

const verifyCallback = {};

verifyCallback.ACCESS = (req, resolve, reject) => {
  return (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ErrorResponse(httpStatus.UNAUTHORIZED, 'Please authenticate')
      );
    }
    // set user to request object
    req.user = user;
    resolve();
  };
};

verifyCallback.REFRESH = (req, resolve, reject) => {
  return (err, refreshTokenDoc, info) => {
    if (err || info || !refreshTokenDoc) {
      return reject(
        new ErrorResponse(httpStatus.UNAUTHORIZED, 'Invalid refresh token')
      );
    }
    // set refreshToken to request object
    req.refreshTokenDoc = refreshTokenDoc;
    resolve();
  };
};

const authorizeAccessToken = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt_access',
      { session: config.jwt.session },
      verifyCallback.ACCESS(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

const authorizeRefreshToken = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt_refresh',
      { session: config.jwt.session },
      verifyCallback.REFRESH(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

// Module exports
module.exports = {
  authorizeAccessToken,
  authorizeRefreshToken,
};
