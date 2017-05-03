
var Generator = require('../DomaineModel/Generator');
var expect = require("chai").expect;

var minTest = 3;
var maxTest = 16;
var analogCategoryTest = 'analog';
var binaryCategoryTest = 'binary';

describe("Generator Unit Test", function() {
    describe("generator constructor", function () {
        it("Should create a generator with the correct attributes", function () {
            var generatorTest = new Generator(analogCategoryTest, minTest, maxTest);

            expect(generatorTest.getMin()).to.equal(minTest);
            expect(generatorTest.getMax()).to.equal(maxTest);
            expect(generatorTest.getCategory()).to.equal(analogCategoryTest);
        });
    });

    describe("getNextValue function", function() {
        it("Should return a real value if category is analog", function() {
            var analogGenerator = new Generator(analogCategoryTest, minTest, maxTest);

            var resultValue = analogGenerator.getNextValue();

            expect(resultValue).isNumber;
        });

        it("Should return a real value between min and max values if category is analog", function() {
            var analogGenerator = new Generator(analogCategoryTest, minTest, maxTest);

            var resultValue = analogGenerator.getNextValue();

            expect(parseInt(resultValue)).to.be.within(minTest, maxTest);
        });

        it("Should return a binary value if category is binary", function() {
            var binaryGenerator = new Generator(binaryCategoryTest, null, null);

            var resultValue = binaryGenerator.getNextValue();

            expect(resultValue).isBinary;
        });
    });

});