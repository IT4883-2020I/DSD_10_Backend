const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const axios = require('axios');
const asyncMiddleware = require('./async');

const auth = async (req, res, next) => {
  const { authorization, projecttype } = req.headers;
  if (!authorization || !projecttype) {
    console.log('chay vao day');
    throw new CustomError(codes.UNAUTHORIZED);
  }

  const [tokenType, token] = authorization.split(' ');

  if (tokenType !== 'Bearer') throw new Error(codes.UNAUTHORIZED);

  const response = await axios.get(
    'https://distributed.de-lalcool.com/api/verify-token',
    {
      headers: {
        'api-token': token,
        'project-type': projecttype,
      },
    }
  );

  const projectType = response.data.result.type;
  let task;
  switch (projectType) {
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
  req.token = token;
  req.projectType = projecttype;
  // if (['/auths/logout', '/auths/verify'].includes(req.path)) {
  //   req.accessToken = accessToken;
  // }

  return next();
};

module.exports = asyncMiddleware(auth);
