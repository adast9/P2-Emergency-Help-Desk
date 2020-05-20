// File information: fx hvor der eksporteres til

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {Case: mongoose.model('case', caseSchema )};
