/* Test functions for the functions located in testFunctions.js file.
 *
 * The type of the test functions are listed as follow accordingly to the listed test functions:
 * Unit testing: 1 - ???
 * Integration testing: ??? - ???
 * End to end testing: ??? - ???
 *
*/

const puppeteer = require("puppeteer");


/*  Unit test for convert function */
const {convert} = require("./testFunctions");

test('should output date in a converted format', () => {
    let date = new Date("Thu May 14 2020 11:10:46 GMT+0200 (Central European Summer Time)");
    const text = convert(date);
    expect(text).toBe('2020-05-14');
});


/*  End to end test with sortTable  */
const {sortTable} = require("./testFunctions");

test("should sort the table in regards to the title", async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 200,
        args: ["--window-size=1920,1080"]
    })
    const page = await browser.newPage();
    await page.goto(
        "file:///C:/Users/fred7/Documents/GitHub/P2-Emergency-Help-Desk/testing/tests.html"
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
}, 20000);
