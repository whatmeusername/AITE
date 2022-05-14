import React from 'react';
import RichBlock from './RichBlock';
import RichStyle from './RichStyle';
import {ATEditor} from './Interfaces';

import defaultBlocks from './defaultStyles/defaultBlocks';
import './ATEditorStandartToolbar.scss';

interface props {
	EditorState: ATEditor;
	setEditorState: Function;
}
