const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const axios = require('axios');

const auth = async (req, res, next) => {
  const { projecttype } = req.headers;
  // console.log(req.headers);
  // if (!authorization) throw new CustomError(codes.UNAUTHORIZED);

  // const [tokenType, token] = authorization.split(' ');
  // console.log({ tokenType, token, projecttype });

  // if (tokenType !== 'Bearer') throw new Error(codes.UNAUTHORIZED);

  let task;
  switch (projecttype) {
    case 'CHAY_RUNG':
      task = 'Cháy rừng';
      break;
    case 'DE_DIEU':
      task = 'Đê điều';
      break;
    case 'CAY_TRONG':
      task = 'Cây trồng';
      break;
    case 'LUOI_DIEN':
      task = 'Điện';
      break;
  }

  req.task = task;
  // if (['/auths/logout', '/auths/verify'].includes(req.path)) {
  //   req.accessToken = accessToken;
  // }

  return next();
};

module.exports = auth;
