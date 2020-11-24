require('dotenv').config();
require('../models/mongoose');

const AttachParam = require('../models/attachParam');

(async () => {
  let i = 0;
  await AttachParam.create({
    name: 'Nhiệt độ',
    description: '',
    property: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await AttachParam.create({
    name: 'Nguồn UAV',
    description: '',
    property: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await AttachParam.create({
    name: 'Thời gian',
    description: '',
    property: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await AttachParam.create({
    name: 'Độ ẩm',
    description: '',
    property: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await AttachParam.create({
    name: 'Toạ độ',
    description: '',
    property: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await AttachParam.create({
    name: 'Hành trình',
    description: '',
    property: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await AttachParam.create({
    name: 'Thời tiết',
    description: '',
    property: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  process.exit();
})();
