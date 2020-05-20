const puppeteer = require("puppeteer");
const jsDom = require("@testing-library/jest-dom");

test("should search for Burger King in the table of posts", async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: ["--window-size=1920,1080"]
    })
    const page = await browser.newPage();
    await page.goto(
        "file:///C:/Users/fred7/Documents/GitHub/P2-Emergency-Help-Desk/testing/mockTable.html"
    );

    await page.click("input#input");
    await page.type("input#input", "Burger");

    // expect(wrapper.find('#titleElement3').hasStyle('display', 'none')).toBe(true)



    await wait(() => expect(getByText("Burger King")).toBeVisible());
    // expect(getByText("Corona")).not.toBeVisible();
    // expect(getByText("McDonalds")).not.toBeVisible();
    // expect(getByText("Sunset")).not.toBeVisible();

    await browser.close();

}, 10000);
