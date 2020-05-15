// File information

const Post = require("../databaseModels/PostModel").Post;

// Module is exported so it can be imported in "dispatcherRoutes"
module.exports = {
    getEmd: (req, res) => {
        res.render("layouts/dispatcher")
    }
};
