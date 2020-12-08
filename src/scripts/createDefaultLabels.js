require('dotenv').config();
require('../models/mongoose');

const Label = require('../models/label');

(async () => {
  let i = 0;
  await Label.create({
    name: 'Nhiệt độ',
    description: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await Label.create({
    name: 'Nguồn UAV',
    description: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await Label.create({
    name: 'Thời gian',
    description: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await Label.create({
    name: 'Độ ẩm',
    description: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await Label.create({
    name: 'Toạ độ',
    description: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await Label.create({
    name: 'Hành trình',
    description: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  await Label.create({
    name: 'Thời tiết',
    description: '',
    isDefault: true,
  });
  i++;
  console.log('Finished: ', i);

  process.exit();
})();
