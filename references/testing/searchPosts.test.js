const puppeteer = require("puppeteer");
const jsDom = require("@testing-library/jest-dom");
const lib = require("@testing-library/dom/dist/@testing-library/dom.umd.js");

test("should search for Burger King in the table of posts", async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: ["--window-size=1920,1080"]
    })
    const page = await browser.newPage();
    await page.goto(
        "file:///C:/Users/fred7/Documents/GitHub/P2-Emergency-Help-Desk/references/testing/mockBrowser.html"
    );

    await page.click("input#input");
    await page.type("input#input", "Burger");

    // let a;
    //
    // await page.evaluate((a) => {
    //   document.querySelector('#titleElement1').value = a;
    // }, a);
    //
    // function myFunction() {
    //     var x = a;
    //     if (window.getComputedStyle(x).visibility === "none") {
    //         return true;
    //     }
    // }
    //
    // expect(myFunction()).toBe(true);

//     const isNotHidden = await page.$eval('#titleElement3', (elem) => {
//     return window.getComputedStyle(elem).getPropertyValue('display') !== 'none' && elem.offsetHeight
// });

    expect(('#titleElement1').style.visibility).toBe("none");

    // expect(isNotHidden).toBe ();
    // expect(getByText("Corona")).not.toBeVisible();
    // expect(getByText("McDonalds")).not.toBeVisible();
    // expect(getByText("Sunset")).not.toBeVisible();

    await browser.close();

}, 10000);
