const puppeteer = require("puppeteer");

test("should insert new case in table", async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 0,
        args: ["--window-size=1920,1080"]
    })
    const page = await browser.newPage();
    await page.goto(
        "file:///C:/Users/fred7/Documents/GitHub/P2-Emergency-Help-Desk/references/testing/mockBrowser.html"
    );

    await page.click("#insert");

    const data = await page.evaluate(() => {
        const table = document.querySelector('#cases');
        let output = [];
        for (var x = 1; x < table.rows.length; x++) {
            for (var y = 0; y < table.rows[x].cells.length; y++)
                output.push(table.rows[x].cells[y].innerHTML);
        }
        output.push(JSON.stringify(table.rows[1].marker.position))
        return output;
    });

    const expectedData = [
      '<button class="btn btn-outline-dark">1</button>',
      'Open',
      '12:45',
      '{"lat":56.26392,"lng":9.5017855}'
    ];

    expect(data).toEqual(expectedData);

    await browser.close();
}, 30000);
