const AttachParam = require('../models/attachParam');

const createOtherAttachParam = async (req, res) => {
  const { name, description, property } = req.body;

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
