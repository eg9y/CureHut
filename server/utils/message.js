const moment = require("moment");

const generateMsg = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

module.exports = {
  generateMsg
};
