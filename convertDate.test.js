// convertDate unit testing
const { convert } = require('references/scripts/convertDate');

test('should output date in a converted format', () => {
    let date = 1589447829248;
    const text = convert(date);
    expect(text).toBe('2020-05-14');
});