/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the test for the searchPosts function used on the editor side.
The function can be found in searchPost.js
*/

const puppeteer = require("puppeteer");

test("should search for Burger King in the table of posts and only show the post with the title; Burger King", async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 0,
        args: ["--window-size=1920,1080"]
    })
    const page = await browser.newPage();
    await page.goto(
        "file:///C:/Users/fred7/Documents/GitHub/P2-Emergency-Help-Desk/references/testing/mockBrowser.html"
    );

    await page.click("input#input");
    await page.type("input#input", "Burger King");

    const isNotHidden = await page.$eval('#element3', (elem) => {
    return elem.style.display !== 'none'
    });

    const isHidden = await page.$eval('#element2', (elem) => {
    return elem.style.display === 'none'
    });

    expect(isNotHidden).toBeTruthy();
    expect(isHidden).toBeTruthy();

    await browser.close();

}, 10000);
