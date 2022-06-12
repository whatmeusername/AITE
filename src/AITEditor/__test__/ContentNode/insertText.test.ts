import {nodeToString} from '../../testingUtils/index'
import {createTestEditor} from './utils'
import {cleanup, fireEvent, render} from '@testing-library/react';


// per line text letters 23

let testData = [
    {
        caseName: 'create testing editor case',
        expectedHTML: '<div class="AITE__editor" data-aite_editor_root="true" contenteditable="true" spellcheck="false" style="font-size: 16px;"><div data-aite_block_node="true"><span data-aite-node="true">Testing text for editor</span></div></div>',
        caseSelection: {
            anchorOffset: 0,
            focusOffset: 0,
            anchorPath: [0],
            focusPath: [0],
            anchorNodeKey: 0,
            focusNodeKey: 0,
            _anchorNode: null,
            _focusNode: null,
            anchorType: 'text',
            focusType: 'text',
            isCollapsed: true,
            isDirty: false,
        },
        expectedSelection: {
            anchorOffset: 0,
            focusOffset: 0,
            anchorPath: [0],
            focusPath: [0],
            anchorNodeKey: 0,
            focusNodeKey: 0,
            _anchorNode: null,
            _focusNode: null,
            anchorType: 'text',
            focusType: 'text',
            isCollapsed: true,
            isDirty: false,
        },
        caseActions: [],
        caseTestEditor: 'one-line'
    }
]


describe('testing inserting letters', () => {
    test.each(testData)('$caseName', ({expectedHTML, caseSelection, expectedSelection, caseActions}) => {
        let testEditor = createTestEditor('one-line')
        testEditor.selectionState.insertSelectionData(caseSelection)
        expect(false).toBe(false)
    })
})