const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const AttachParam = require('../models/attachParam');

const createOtherAttachParam = async (req, res) => {
  const { name, description, property } = req.body;

  const isExistAttachParam = await AttachParam.findOne({ name });
  if (isExistAttachParam) {
    throw new CustomError(
      codes.BAD_REQUEST,
      'Name of attach param was duplicated'
    );
  }

  const otherAttachParam = await AttachParam.create({
    name,
    description,
    property,
    isDefault: false,
  });
  res.send({
    status: 1,
    result: {
      otherAttachParam,
    },
  });
};

const getAttachParams = async (req, res) => {
  const attachParams = await AttachParam.find({});

  res.send({
    status: 1,
    result: {
      attachParams,
    },
  });
};

const updateOtherAttachParam = async (req, res) => {
  const { _id, name, description, property } = req.body;

  if (!_id) {
    throw new CustomError(codes.BAD_REQUEST, 'Missing _id');
  }

  const otherAttachParam = await AttachParam.findByIdAndUpdate(
    _id,
    {
      name,
      description,
      property,
    },
    {
      new: true,
    }
  );

  if (!otherAttachParam) {
    throw new CustomError(codes.NOT_FOUND);
  }

  res.send({
    status: 1,
    result: {
      otherAttachParam,
    },
  });
};

const removeOtherAttachParam = async (req, res) => {
  const { _id } = req.body;
  const otherAttachParam = await AttachParam.findByIdAndRemove(_id);
  if (!otherAttachParam) {
    throw new CustomError(codes.NOT_FOUND);
  }

  res.send({
    status: 1,
    result: {
      otherAttachParam,
    },
  });
};

module.exports = {
  createOtherAttachParam,
  getAttachParams,
  updateOtherAttachParam,
  removeOtherAttachParam,
};
