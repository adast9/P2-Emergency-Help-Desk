const puppeteer = require("puppeteer");

test("should translate text from English to Danish", async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 250,
        args: ["--window-size=1920,1080"]
    })
    const page = await browser.newPage();
    await page.goto(
        "file:///C:/Users/fred7/Documents/GitHub/P2-Emergency-Help-Desk/references/testing/mockBrowser.html"
    );

    await page.mouse.click(10, 20);

    await page.mouse.click(250, 260);

    const text = await page.$eval('#someText', (elem) => {
    return elem.textContent;
    });

    expect(text).toBe("Tekst der skal oversættes.")

    await browser.close();

}, 40000);
