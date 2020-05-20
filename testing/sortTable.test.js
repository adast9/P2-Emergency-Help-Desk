/* The package puppeteer which is used for end to end tests and setting up a dummy browser */
const puppeteer = require("puppeteer");

test("should sort the mock table from tests.html in regards to the title in asc and dsc order", async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 40,
        args: ["--window-size=1920,1080"]
    })
    const page = await browser.newPage();
    await page.goto(
        "file:///C:/Users/fred7/Documents/GitHub/P2-Emergency-Help-Desk/testing/mockTable.html"
    );

    /* For ascending */
    await page.click("#sort");

    const dataAsc = await page.evaluate(() => {
    const tdsAsc = Array.from(document.querySelectorAll('table tr td'))
    return tdsAsc.map(td => td.innerHTML)
    });

    const expectedArrAsc = ["Burger King", "Carole", "Burger King is worse", "2050-12-05", "Corona", "Bob",
    "something something corona", "2002-05-11", "McDonalds", "John", "McDonalds is bad", "2040-11-12", "Sunset", "Thor", "Sunset is better", "2999-05-12"];

    /*For descending */
    await page.click("#sort");

    const dataDsc = await page.evaluate(() => {
    const tdsDsc = Array.from(document.querySelectorAll('table tr td'))
    return tdsDsc.map(td => td.innerHTML)
    });

    const expectedArrDsc = ["Sunset", "Thor", "Sunset is better", "2999-05-12", "McDonalds", "John", "McDonalds is bad",
    "2040-11-12", "Corona", "Bob", "something something corona", "2002-05-11", "Burger King", "Carole", "Burger King is worse", "2050-12-05",];

    const addedArray = dataAsc.concat(dataDsc);
    const expectedAddedArray = expectedArrAsc.concat(expectedArrDsc);

    expect(addedArray).toEqual(expectedAddedArray);

    await browser.close();
}, 30000);
