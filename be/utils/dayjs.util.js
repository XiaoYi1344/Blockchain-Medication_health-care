const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

function parseDateTime(input) {
  const date = dayjs(input, 'YYYY-MM-DD HH:mm', true);
  if (!date.isValid()) {
    throw new Error(`F57: ${input}`);
  }
  return true;
}

module.exports = { dayjs, parseDateTime };