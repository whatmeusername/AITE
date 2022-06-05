function sum(a, b) {
    return a + b;
};

describe("Sum", () => {
    test("sum two numbers", () => {
        expect(sum(1, 1)).toEqual(2);
    });
});