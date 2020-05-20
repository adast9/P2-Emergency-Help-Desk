const mongoose = require("mongoose");
const Post = require("./testModel.js").Test;

beforeAll(async () => {
    const mongodbURL = "mongodb+srv://dev:dev@clustercms-faqog.gcp.mongodb.net/cmsdb?retryWrites=true&w=majority";

    await mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true })

    await Post.insertMany({
        title: "Some title",
        author: "Bob",
        imageFile: "file",
        description: "a description",
        pdfFile: "a file"
    })
});

afterAll(async () => {
    await Post.deleteOne({});
    await mongoose.connection.close();
});

test("should connect to MongoDB and find the mock post", async () => {
    const title = "Some title";

    const post = await Post.findOne({title});

    expect(post.title).toEqual(title);
    expect(post.author).toEqual("Bob");
    expect(post.imageFile).toEqual("file");
    expect(post.description).toEqual("a description");
    expect(post.pdfFile).toEqual("a file");
});
