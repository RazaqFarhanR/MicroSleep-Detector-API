const models = require("../models");
const Device = models.devices;

const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateSerialNumber = async () => {
  let serialNumber;
  const year = new Date().getFullYear();

  do {
    const randomPart = generateRandomString(6);
    const timestamp = Date.now().toString().slice(-3); 
    serialNumber = `MS-${randomPart}-${year}-${timestamp}`;
    
    const existingDevice = await Device.findOne({ where: { serial_number: serialNumber } });
    if (!existingDevice) {
      break; 
    }
  } while (true);

  return serialNumber;
};

module.exports = {
  generateSerialNumber,
};
