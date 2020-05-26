/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains whether the file connects to MongoDB and if a post gets uploaded.
*/

const mongoose = require("mongoose");
const Post = require("../../databaseModels/postModel.js").Post;

beforeAll(async () => {
    const mongodbURL = "mongodb+srv://dev:dev@clustercms-faqog.gcp.mongodb.net/cmsdb?retryWrites=true&w=majority";

    await mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true })

    await Post.insertMany({
        title: "testtest title",
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
    const title = "testtest title";

    const post = await Post.findOne({title});

    expect(post.title).toEqual(title);
    expect(post.author).toEqual("Bob");
    expect(post.imageFile).toEqual("file");
    expect(post.description).toEqual("a description");
    expect(post.pdfFile).toEqual("a file");
});
