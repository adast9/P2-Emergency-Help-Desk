const mongoose = require('mongoose');
const Schema = mongoose.Schema;



module.exports = {Case: mongoose.model('case', CaseSchema )};
