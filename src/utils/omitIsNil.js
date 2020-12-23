const omitIsNil = (obj, deep = false) => {
  if (typeof obj !== 'object' || !obj) return {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });

  if (deep) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        omitIsNil(obj[key], true);
      }
    });
  }

  return obj;
};

module.exports = { omitIsNil };
