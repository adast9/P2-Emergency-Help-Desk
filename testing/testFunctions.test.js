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
        slowMo: 20,
        args: ["--window-size=1920,1080"]
    })
    const page = await browser.newPage();
    await page.goto(
        "file:///C:/Users/fred7/Documents/GitHub/P2-Emergency-Help-Desk/testing/tests.html"
    );

    /* For ascending */

    await page.click("#sort");

    let title1 = await page.$eval('#titleElement1', el => el.textContent);
    let title2 = await page.$eval('#titleElement2', el => el.textContent);
    let title3 = await page.$eval('#titleElement3', el => el.textContent);
    let title4 = await page.$eval('#titleElement4', el => el.textContent);

    const titleArrAsc = [title3, title1, title2, title4];
    const expectedArrAsc = ["Burger King", "Corona", "McDonalds", "Sunset"];

    /* For descending */

    await page.click("#sort");

    let newtitle1 = await page.$eval('#titleElement1', el => el.textContent);
    let newtitle2 = await page.$eval('#titleElement2', el => el.textContent);
    let newtitle3 = await page.$eval('#titleElement3', el => el.textContent);
    let newtitle4 = await page.$eval('#titleElement4', el => el.textContent);

    const titleArrDsc = [title4, title2, title1, title3];
    const expectedArrDsc = ["Sunset", "McDonalds", "Corona", "Burger King"];

    const addedArray = titleArrAsc.concat(titleArrDsc);
    const expectedAddedArray = expectedArrAsc.concat(expectedArrDsc);

    expect(addedArray).toEqual(expectedAddedArray);

    await browser.close();
});
