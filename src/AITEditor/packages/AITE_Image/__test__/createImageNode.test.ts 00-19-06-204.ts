import {createImageNode, imageNode} from '../imageNode'



let testData = [
    {
        testName: 'validate standart image url with no errors',
        url: 'http://example.com/example.jpg',
        expectedImageNode: true
    },
    {
        testName: 'validate standart image url with no errors with other extension',
        url: 'https://example.com/example.png',
        expectedImageNode: true
    },
    {
        testName: 'validate standart image url with no errors with gif extension',
        url: 'https://example.com/example.gif',
        expectedImageNode: true
    },
    {
        testName: 'validate standart image url with errors in protocol',
        url: 'httpss://example.com/example.png',
        expectedImageNode: false
    },
    {
        testName: 'validate standart image url with errors in file extension',
        url: 'http://example.com/example.pdf',
        expectedImageNode: false
    }
]

describe('creating image node', () => {
    test.each(testData)('$testName', ({url, expectedImageNode}) => {
        let imageNode = createImageNode({src: url})
        let checkIfImageExists = imageNode?.imageConf.src !== undefined
        expect(checkIfImageExists).toBe(expectedImageNode)
    })
})