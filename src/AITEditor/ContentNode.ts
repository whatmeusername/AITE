import BlockNode, {HorizontalRuleNode} from './BlockNode';
import {SelectionState, BlockPath} from './SelectionUtils';
import {BREAK_LINE_TAGNAME, BREAK_LINE_TYPE, ELEMENT_NODE_TYPE, TEXT_NODE_TYPE, STANDART_BLOCK_TYPE} from './ConstVariables';
import {TextNode, LinkNode} from './AITE_nodes/index'
import createImageNode from './packages/AITE_Image/imageNode';

import ValidationUtils from './ValidationUtils';
import {BlockType} from './BlockNode';

interface contentNodeConf {
	BlockNodes?: Array<BlockType>;
}

export default class ContentNode {
	blocksLength: () => number;
	BlockNodes: Array<BlockNode | HorizontalRuleNode>;

	constructor(contentNodeConf?: contentNodeConf) {
		this.blocksLength = () => {
			return this.BlockNodes.length;
		};
		this.BlockNodes = contentNodeConf?.BlockNodes ?? [
			new BlockNode({
				NodeData: [new TextNode({plainText: 'Тестовый текст для редактора'})],
				blockWrapper: 'header-two',
			}),
			new HorizontalRuleNode(),
			new BlockNode({
				blockWrapper: 'blockquote',
				NodeData: [
					new TextNode(
						{plainText: `Программи́рование — процесс создания компьютерных программ. По выражению одного из основателей языков программирования Никлауса Вирта «Программы = алгоритмы + структуры данных». Программирование основывается на использовании языков программирования, на которых записываются исходные тексты программ.`}
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'header-one',
				NodeData: [new TextNode({plainText: `Языки программирования`})],
			}),
			new BlockNode({
				NodeData: [
					createImageNode({
						src: 'https://i.gifer.com/2GU.gif',
						float: 'right',
					}),
					new TextNode(
						{plainText: `Большая часть работы программистов связана с написанием исходного кода, тестированием и отладкой программ на одном из языков программирования. Исходные тексты и исполняемые файлы программ являются объектами авторского права и являются интеллектуальной собственностью их авторов и правообладателей.
Различные языки программирования поддерживают различные стили программирования (парадигмы программирования). Выбор нужного языка программирования для некоторых частей алгоритма позволяет сократить время написания программы и решить задачу описания алгоритма наиболее эффективно. Разные языки требуют от программиста различного уровня внимания к деталям при реализации алгоритма, результатом чего часто бывает компромисс между простотой и производительностью (или между «временем программиста» и «временем пользователя»).
Единственный язык, напрямую выполняемый ЭВМ — это машинный язык (также называемый машинным кодом и языком машинных команд). Изначально все программы писались в машинном коде, но сейчас этого практически уже не делается. Вместо этого программисты пишут исходный код на том или ином языке программирования, затем, используя компилятор, транслируют его в один или несколько этапов в машинный код, готовый к исполнению на целевом процессоре, или в промежуточное представление, которое может быть исполнено специальным интерпретатором — виртуальной машиной. Но это справедливо только для языков высокого уровня. Если требуется полный низкоуровневый контроль над системой на уровне машинных команд и отдельных ячеек памяти, программы пишут на языке ассемблера, мнемонические инструкции которого преобразуются один к одному в соответствующие инструкции машинного языка целевого процессора ЭВМ (по этой причине трансляторы с языков ассемблера получаются алгоритмически простейшими трансляторами).
`,
						stylesArr: ['ITALIC']},
					),
					new LinkNode({
						plainText: 'wikipedia2',
						url: 'https://ru.wikipedia.org/wiki/Заглавная_страница',
					}),
					new LinkNode({
						plainText: ' wikipedia',
						stylesArr: ['BOLD'],
						url: 'https://ru.wikipedia.org/wiki/Заглавная_страница',
					}),
					new TextNode({
						plainText: 'wikipedia2',
					}),
					new LinkNode({
						plainText: ' wikipedia',
						url: 'https://ru.wikipedia.org/wiki/Заглавная_страница',
					}),
				],
			}),
			new BlockNode({
				blockWrapper: 'blockquote',
				NodeData: [
					new TextNode(
						{plainText: `В некоторых языках вместо машинного кода генерируется интерпретируемый двоичный код «виртуальной машины», также называемый байт-кодом (byte-code). Такой подход применяется в Forth, некоторых реализациях Lisp, Java, Perl, Python, языках для .NET Framework.`},
					),
				],
			}),
			new HorizontalRuleNode(),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 1`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 2`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 3`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'header-five',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 4`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-unordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 5`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 5`},
					),
				],
			}),
		];
	}

	getCurrentContentNode(selectionKey: BlockPath): ContentNode {
		if (selectionKey.length() !== 1) {
			let currentContentNode = this.getBlockByPath(selectionKey.getPathBeforeLast()) as any;
			if (currentContentNode instanceof ContentNode) return currentContentNode;
			else if (currentContentNode.ContentNode !== undefined) return currentContentNode.ContentNode;
		}
		return this;
	}

	findBlockByIndex(index: number) {
		return this.BlockNodes[index] as BlockNode;
	}

	getBlockByPath(path: Array<number>) {
		let currentBlock: any = this.BlockNodes[path[0]];
		for (let i = 1; i < path.length; i++) {
			if (currentBlock instanceof BlockNode || currentBlock?.NodeData !== undefined) {
				currentBlock = currentBlock.NodeData[path[i]];
			} else if (!(currentBlock instanceof BlockNode)) {
				currentBlock = currentBlock.ContentNode !== undefined ? currentBlock.ContentNode.BlockNodes[path[i]] : currentBlock?.NodeData[path[i]];
			}
		}
		return currentBlock;
	}

	spliceBlockByPath(path: Array<number>): void {
		let currentBlock: any = this.BlockNodes[path[0]];
		if (path.length === 0) {
			this.BlockNodes.splice(path[0], 1);
		} else {
			for (let i = 1; i < path.length; i++) {
				if (i !== path.length - 1) {
					if (currentBlock instanceof BlockNode || currentBlock[0] instanceof BlockNode) {
						currentBlock = currentBlock.NodeData[path[i]];
					} else if (!(currentBlock instanceof BlockNode)) {
						currentBlock = currentBlock?.NodeData[path[i]];
					}
				} else currentBlock.splice(path[i], 1);
			}
		}
	}

	TextNodeSlice(char: TextNode, CharToInsert: string = '', start: number, end?: number): void {
		if (start === -1) {
			char.__content = char.__content + CharToInsert;
		} else if (end !== undefined && end !== -1) {
			char.__content = char.__content.slice(0, start) + CharToInsert + char.__content.slice(end);
		} else if (end === -1) {
			char.__content = char.__content.slice(start) + CharToInsert;
		} else {
			char.__content = char.__content.slice(0, start) + CharToInsert;
		}
	}

	MergeWithUpdate(
		BlockNodes: Array<BlockType> | ContentNode,
		selectionState: SelectionState,
		joiningBlockDirection: 'up' | 'down',
		joiningSideDirection: 'left' | 'right',
	): void {
		let AnchorIndex = new BlockPath([...selectionState.anchorPath.get()]);
		let lastConnectingNode = undefined;
		let anchorNodeKey = 0;
		let newAnchorOffset = 0;
		let connectingBlockLength = 0;

		if (joiningSideDirection === 'left') {
			joiningBlockDirection === 'down' ? AnchorIndex.decrementLastPathIndex(1) : AnchorIndex.incrementLastPathIndex(1);

			let connectingBlock = this.getBlockByPath(selectionState.anchorPath.get()) as BlockNode;

			connectingBlockLength = connectingBlock.lastNodeIndex() + 1;
			lastConnectingNode = connectingBlock.NodeData[connectingBlockLength - 1];
			let lastConnectingNodeLength = connectingBlock.NodeData[connectingBlockLength - 1].returnContentLength();

			let connectingMaxSize = connectingBlock.countToIndex(connectingBlockLength - 1);

			let joiningBlock = this.getBlockByPath(AnchorIndex.get()) as BlockNode;

			connectingBlock.NodeData = [...connectingBlock.NodeData, ...joiningBlock.NodeData];
			connectingBlock.blockUpdate();

			if (BlockNodes instanceof ContentNode) BlockNodes.BlockNodes.splice(AnchorIndex.getLastIndex(), 1);
			else BlockNodes.splice(AnchorIndex.getLastIndex(), 1);

			if (connectingBlock.NodeData.length <= connectingBlockLength) {
				let updateAnchorChar = connectingBlock.findNodeByOffset(connectingMaxSize);
				anchorNodeKey = updateAnchorChar.offsetKey;
				newAnchorOffset = updateAnchorChar.letterIndex;
			} else {
				anchorNodeKey = connectingBlockLength - 1;
				newAnchorOffset = lastConnectingNodeLength;
			}





		} else {
			joiningBlockDirection === 'down' ? AnchorIndex.decrementLastPathIndex(1) : AnchorIndex.incrementLastPathIndex(1);

			let connectingBlock = this.getBlockByPath(selectionState.anchorPath.get()) as BlockNode;
			let joiningBlock = this.getBlockByPath(AnchorIndex.get()) as BlockNode;

			connectingBlockLength = connectingBlock.lastNodeIndex() + 1;

			lastConnectingNode = connectingBlock.NodeData[connectingBlockLength - 1];

			connectingBlock.NodeData = [...connectingBlock.NodeData, ...joiningBlock.NodeData];

			connectingBlock.blockUpdate();
			if (BlockNodes instanceof ContentNode) BlockNodes.BlockNodes.splice(AnchorIndex.getLastIndex(), 1);
			else BlockNodes.splice(AnchorIndex.getLastIndex(), 1);

			newAnchorOffset = selectionState.anchorOffset;
			anchorNodeKey = selectionState.anchorNodeKey;
			AnchorIndex.decrementLastPathIndex(1);
		}

		selectionState.focusPath = joiningSideDirection !== 'left' ? AnchorIndex : selectionState.anchorPath;
		selectionState.anchorPath = joiningSideDirection !== 'left' ? AnchorIndex : selectionState.anchorPath;

		selectionState.anchorNodeKey = anchorNodeKey;
		selectionState.focusNodeKey = selectionState.anchorNodeKey;

		selectionState._anchorNode = selectionState.anchorNodeKey;
		selectionState._focusNode = selectionState.anchorNodeKey;

		selectionState.anchorOffset = newAnchorOffset;
		selectionState.focusOffset = newAnchorOffset;

		selectionState.anchorType = lastConnectingNode.returnType();
		selectionState.focusType = lastConnectingNode.returnType();

		selectionState.isDirty = true;
		selectionState.isCollapsed = true;
	}

	sliceBlockFromContent(start: number, end?: number): void {
		this.BlockNodes = [...this.BlockNodes.slice(0, start), ...this.BlockNodes.slice(end ?? start)];
	}

	insertBlockNodeBetween(block: BlockNode, start: number, end?: number): void {
		if (end !== undefined) {
			this.BlockNodes = [...this.BlockNodes.slice(0, start), block, ...this.BlockNodes.slice(end ?? start)];
		} else {
			this.BlockNodes = [...this.BlockNodes.slice(0, start), block];
		}
	}

	getTextNodeOffset(node: TextNode, offset: number): number {
		let TextContentLength = node.returnContentLength();
		if (offset === -1) {
			offset = TextContentLength;
		} else if (offset > TextContentLength) {
			offset = TextContentLength;
		}
		return offset;
	}

	insertLetterIntoTextNode(KeyBoardEvent: React.KeyboardEvent, selectionState: SelectionState): void {
		let Key = KeyBoardEvent.key;

		let anchorBlockNode = this.getBlockByPath(selectionState.anchorPath.get()) as BlockNode;
		let focusBlockNode = this.getBlockByPath(selectionState.focusPath.get()) as BlockNode;

		let anchorNodeData = anchorBlockNode.NodeData !== undefined ? anchorBlockNode.getNodeByIndex(selectionState.anchorNodeKey) : undefined;
		let focusNodeData = focusBlockNode.NodeData !== undefined ? focusBlockNode.getNodeByIndex(selectionState.focusNodeKey) : undefined;

		if (selectionState.isCollapsed) {
			let SliceFrom = selectionState.anchorOffset;
			let SliceTo = selectionState.focusOffset;

			if (ValidationUtils.isTextNode(anchorNodeData)) {
				if (Key === ' ' && KeyBoardEvent.which === 229) {
					Key = '. ';
					SliceFrom -= 1;
				}

				this.TextNodeSlice(anchorNodeData as TextNode, Key, SliceFrom, SliceTo);
				if (selectionState.anchorType === BREAK_LINE_TYPE) {
					selectionState.convertBreakLineToText();
					selectionState.moveSelectionForward();
				} else {
					selectionState.moveSelectionForward();
				}
			} else {
				let nextNode = anchorBlockNode.nextSibling(selectionState.anchorNodeKey) as TextNode;
				if (nextNode === undefined || ValidationUtils.isTextNode(nextNode) === false) {
					let nextNode = new TextNode();
					anchorBlockNode.splitCharNode(true, selectionState.anchorNodeKey + 1, selectionState.focusNodeKey + 1, nextNode);
					this.TextNodeSlice(nextNode, Key, 0, 0);
					selectionState.toggleCollapse(true);
					selectionState.moveSelectionForward();
					selectionState.enableDirty();
				} else if (ValidationUtils.isTextNode(nextNode) === true) {
					this.TextNodeSlice(nextNode, Key, 0, 0);
					selectionState.toggleCollapse(true);
					selectionState.enableDirty();
				}
			}
		} else if (selectionState.blockPathIsEqual() === true) {
			if (selectionState.isNodesSame() === false) {
				let CharSplitStart = selectionState.anchorNodeKey + 1;
				let CharSplitEnd = selectionState.focusNodeKey;

				if (ValidationUtils.isTextNode(anchorNodeData)) {
					this.TextNodeSlice(anchorNodeData as TextNode, Key, selectionState.anchorOffset);
				} else {
					let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorNodeKey);
					if (previousSibling !== undefined && ValidationUtils.isTextNode(previousSibling) === true) {
						this.TextNodeSlice(previousSibling as TextNode, Key, -1);
					} else anchorBlockNode.splitCharNode(true, CharSplitStart, CharSplitStart + 1, new TextNode());
					CharSplitStart -= 1;
				}

				if (ValidationUtils.isTextNode(focusNodeData)) {
					this.TextNodeSlice(focusNodeData as TextNode, '', selectionState.focusOffset, -1);
				} else CharSplitEnd += 1;

				anchorBlockNode.splitCharNode(true, CharSplitStart, CharSplitEnd);

				selectionState.moveSelectionForward();
				selectionState.toggleCollapse();
			} else {
				if (ValidationUtils.isTextNode(anchorNodeData)) {
					anchorNodeData = anchorNodeData as TextNode;
					this.TextNodeSlice(anchorNodeData, Key, selectionState.anchorOffset, selectionState.focusOffset);

					if (anchorNodeData.returnContent() === '') {
						anchorBlockNode.splitCharNode(true, selectionState.anchorNodeKey);
						selectionState.moveSelectionToPreviousSibling(this);
					} else {
						selectionState.toggleCollapse();
						selectionState.moveSelectionForward();
					}
				} else {
					anchorBlockNode.splitCharNode(false, selectionState.anchorNodeKey, selectionState.anchorNodeKey + 1);
				}
			}
		} else if (selectionState.blockPathIsEqual() === false) {
			let CharSplitStart = selectionState.anchorNodeKey + 1;
			let CharSplitEnd = selectionState.focusNodeKey;

			if (anchorNodeData !== undefined) {
				if (ValidationUtils.isTextNode(anchorNodeData)) {
					this.TextNodeSlice(anchorNodeData as TextNode, Key, selectionState.anchorOffset);
				} else {
					let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorNodeKey);
					if (previousSibling !== undefined && ValidationUtils.isTextNode(previousSibling)) {
						this.TextNodeSlice(previousSibling as TextNode, Key, -1);
					} else {
						let newTextNode = new TextNode();
						anchorBlockNode.splitCharNode(false, CharSplitStart, CharSplitStart + 1, newTextNode);
					}
					CharSplitStart -= 1;
				}
				anchorBlockNode.bulkRemoveCharNode(true, CharSplitStart);
			}

			if (focusNodeData !== undefined) {
				if (ValidationUtils.isTextNode(focusNodeData)) {
					this.TextNodeSlice(focusNodeData as TextNode, anchorNodeData === undefined ? Key : '', selectionState.focusOffset, -1);
				} else {
					CharSplitEnd += 1;
				}

				focusBlockNode.bulkRemoveCharNode(false, CharSplitEnd, undefined);
			}

			if (selectionState.anchorPath.length() === 1) {
				this.sliceBlockFromContent(selectionState.anchorPath.getPathIndexByIndex(0) + 1, selectionState.focusPath.getPathIndexByIndex(0));
			} else {
				let blockWrapper = this.getBlockByPath(selectionState.anchorPath.getPathBeforeLast());
				blockWrapper.ContentNode
					? blockWrapper.ContentNode.sliceBlockFromContent(
							selectionState.anchorPath.getPathIndexByIndex(0) + 1,
							selectionState.focusPath.getPathIndexByIndex(0),
					  )
					: (blockWrapper.NodeData = [
							...blockWrapper.NodeData.slice(0, selectionState.anchorPath.getPathIndexByIndex(0) + 1),
							...blockWrapper.NodeData.slice(selectionState.focusPath.getPathIndexByIndex(0)),
					  ]);
			}

			if (focusNodeData !== undefined && anchorNodeData !== undefined) {
				let blocksArray = [];
				if (selectionState.anchorPath.length() === 1) {
					blocksArray = this.BlockNodes;
				} else {
					blocksArray = this.getBlockByPath(selectionState.anchorPath.getPathBeforeLast());
				}
				this.MergeWithUpdate(blocksArray.ContentNode ? blocksArray.ContentNode : blocksArray, selectionState, 'up', 'right');
				selectionState.moveSelectionForward();
			} else if (anchorNodeData !== undefined) selectionState.moveSelectionForward();
			else if (focusNodeData !== undefined) {
				selectionState.focusOffset = 0;
				selectionState.toggleCollapse(true);
			}
		}
	}
	removeLetterFromBlock(selectionState: SelectionState): void {
		let anchorBlockNode = this.getBlockByPath(selectionState.anchorPath.get()) as BlockNode;
		let focusBlockNode = this.getBlockByPath(selectionState.focusPath.get()) as BlockNode;

		if (selectionState.isFullBlockSelected() === true) {
			let textSliceAnchor = selectionState.anchorPath;
			this.sliceBlockFromContent(textSliceAnchor.getLastIndex(), textSliceAnchor.getLastIndex() + 1);

			selectionState.moveSelectionToPreviousSibling(this);
		}

		let anchorNodeData = anchorBlockNode.NodeData ? anchorBlockNode.NodeData[selectionState.anchorNodeKey] : undefined;
		let focusNodeData = focusBlockNode.NodeData ? focusBlockNode.NodeData[selectionState.focusNodeKey] : undefined;

		if (anchorNodeData === undefined && focusNodeData === undefined) return;
		else if (selectionState.isCollapsed) {
			if (selectionState.isOffsetOnStart()) {
				let currentContentNode = undefined;
				if (selectionState.anchorPath.length() === 1) currentContentNode = this;
				else currentContentNode = this.getBlockByPath(selectionState.anchorPath.getPathBeforeLast());

				currentContentNode = currentContentNode.ContentNode ?? currentContentNode;

				if (selectionState.anchorPath.getLastIndex() !== 0 && currentContentNode instanceof ContentNode) {
					let previousBlockPath = new BlockPath(selectionState.anchorPath.get());
					previousBlockPath.decrementLastPathIndex(1);

					let previousBlock = currentContentNode.BlockNodes[previousBlockPath.getLastIndex()] as BlockNode;

					if (previousBlock.getType() !== STANDART_BLOCK_TYPE) {
						currentContentNode.sliceBlockFromContent(selectionState.anchorPath.getLastIndex(), selectionState.anchorPath.getLastIndex() + 1);
						selectionState.toggleCollapse();
						selectionState.convertBreakLineToText();
					} else {
						this.MergeWithUpdate(currentContentNode.BlockNodes, selectionState, 'up', 'left');
					}
				}
			} else {
				if (anchorNodeData === undefined || anchorBlockNode === undefined) return;
				let textSliceAnchor = selectionState.anchorOffset - 1;
				let SliceFocus = selectionState.focusOffset;
				let anchorNodeType = anchorNodeData.returnType();

				if (selectionState.anchorOffset === 0) {
					if (anchorBlockNode.previousSibling(selectionState.anchorNodeKey)?.returnType() === ELEMENT_NODE_TYPE) {
						anchorBlockNode.removeCharNode(selectionState.anchorNodeKey - 1);
						selectionState.anchorNodeKey -= 1;
						selectionState.toggleCollapse();
						selectionState.isDirty = true;
					}
				} else if (anchorNodeType === TEXT_NODE_TYPE) {
					anchorNodeData = anchorNodeData as TextNode;
					this.TextNodeSlice(anchorNodeData, '', textSliceAnchor, SliceFocus);

					if (anchorBlockNode.lastNodeIndex() > 0 && anchorNodeData.returnContent() === '') {
						anchorBlockNode.removeCharNode(selectionState.anchorNodeKey)
						selectionState.moveSelectionToPreviousSibling(this);
					} else {
						selectionState.moveSelectionBack();
						if (anchorBlockNode.lastNodeIndex() === 0 && anchorNodeData.returnContentLength() === 0) {
							selectionState.enableDirty()
						}
					}
				}
			}
		} else {
			if (selectionState.blockPathIsEqual() === true) {
				if (selectionState.isNodesSame()) {
					if (ValidationUtils.isTextNode(anchorNodeData)) {
						anchorNodeData = anchorNodeData as TextNode;

						let textSliceAnchor = selectionState.anchorOffset;
						let textSliceFocus = selectionState.focusOffset;

						this.TextNodeSlice(anchorNodeData, '', textSliceAnchor, textSliceFocus);

						if (anchorNodeData.returnContent() === '') {
							anchorBlockNode.removeCharNode(selectionState.anchorNodeKey);
							selectionState.moveSelectionToPreviousSibling(this);
						} else selectionState.toggleCollapse();
					} else {
						anchorBlockNode.removeCharNode(selectionState.anchorNodeKey);
						selectionState.moveSelectionToPreviousSibling(this);
					}
				} else if (selectionState.anchorNodeKey !== selectionState.focusNodeKey) {
					let textSliceAnchor = selectionState.anchorOffset;
					let textSliceFocus = selectionState.focusOffset;

					let nodeSliceAnchor = selectionState.anchorNodeKey + 1;
					let nodeSliceFocus = selectionState.focusNodeKey;

					if (ValidationUtils.isTextNode(anchorNodeData)) {
						anchorNodeData = anchorNodeData as TextNode;
						this.TextNodeSlice(anchorNodeData, '', textSliceAnchor);
						if (anchorNodeData.returnContent() === '') {
							nodeSliceAnchor -= 1;
							selectionState.moveSelectionToPreviousSibling(this);
						} else {
							selectionState.toggleCollapse();
							selectionState.isDirty = true;
						}
					} else {
						nodeSliceFocus -= 1;
						selectionState.moveSelectionToPreviousSibling(this);
					}

					if (ValidationUtils.isTextNode(focusNodeData)) {
						focusNodeData = focusNodeData as TextNode;
						this.TextNodeSlice(focusNodeData, '', textSliceFocus, -1);
						if (focusNodeData.returnContent() === '') nodeSliceFocus += 1;
					} else nodeSliceFocus += 1;

					anchorBlockNode.splitCharNode(true, nodeSliceAnchor, nodeSliceFocus);
				}
			} else if (selectionState.blockPathIsEqual() === false) {
				let textSliceAnchor = selectionState.anchorOffset;
				let textSliceFocus = selectionState.focusOffset;

				let BlockSliceAnchor = selectionState.anchorPath.getLastIndex() + 1;
				let BlockSliceFocus = selectionState.focusPath.getLastIndex();

				let nodeSliceAnchor = selectionState.anchorNodeKey + 1;
				let nodeSliceFocus = selectionState.focusNodeKey;

				anchorNodeData = anchorNodeData as TextNode;
				focusNodeData = focusNodeData as TextNode;

				if (anchorNodeData === undefined) BlockSliceAnchor -= 1;
				else {
					if (ValidationUtils.isTextNode(anchorNodeData)) {
						anchorNodeData = anchorNodeData as TextNode;
						this.TextNodeSlice(anchorNodeData, '', textSliceAnchor);
						if (anchorNodeData.returnContent() === '') {
							nodeSliceAnchor -= 1;
							selectionState.moveSelectionToPreviousSibling(this);
						} else {
							selectionState.toggleCollapse();
							selectionState.isDirty = true;
						}
					} else {
						nodeSliceAnchor -= 1;
						selectionState.moveSelectionToPreviousSibling(this);
					}
					anchorBlockNode.bulkRemoveCharNode(true, nodeSliceAnchor);
				}

				if (focusNodeData !== undefined) {
					if (ValidationUtils.isTextNode(focusNodeData)) {
						focusNodeData = focusNodeData as TextNode;
						this.TextNodeSlice(focusNodeData, '', textSliceFocus, -1);
						if (focusNodeData.returnContent() === '') nodeSliceFocus += 1;
					} else nodeSliceFocus += 1;
					focusBlockNode.bulkRemoveCharNode(false, nodeSliceFocus);
				}

				if (selectionState.anchorPath.length() > 1) {
					let ParentNode = this.getBlockByPath(selectionState.anchorPath.getPathBeforeLast());

					if (ParentNode.ContentNode instanceof ContentNode) {
						ParentNode.ContentNode.sliceBlockFromContent(BlockSliceAnchor, BlockSliceFocus);
						this.MergeWithUpdate(ParentNode.ContentNode, selectionState, 'up', 'left');
					}
				} else {
					this.sliceBlockFromContent(BlockSliceAnchor, BlockSliceFocus)
					this.MergeWithUpdate(this.BlockNodes, selectionState, 'up', 'left');
				}
			}
		}
	}
	handleEnter(selectionState: SelectionState): void {
		let anchorBlockPath = selectionState.anchorPath;

		if (
			selectionState.anchorNodeKey === 0 &&
			selectionState.anchorOffset === 0 &&
			selectionState.focusOffset === 0 &&
			(selectionState.anchorNode as HTMLElement)?.tagName !== BREAK_LINE_TAGNAME
		) {
			this.getCurrentContentNode(anchorBlockPath).insertBlockNodeBetween(
				new BlockNode({NodeData: [new TextNode()]}),
				anchorBlockPath.getLastIndex(),
				anchorBlockPath.getLastIndex(),
			);
			selectionState.moveSelectionToNextSibling(this);
		} else if (selectionState.isCollapsed) {
			let CurrentBlock = this.getBlockByPath(anchorBlockPath.get());
			let anchorOffsetChar = CurrentBlock.findCharByIndex(selectionState.anchorNodeKey) as TextNode;

			let CharNodeSlice = selectionState.anchorNodeKey;
			let SlicedCharNode = undefined;
			let currentContentNode: ContentNode = this.getCurrentContentNode(anchorBlockPath);

			if (selectionState.anchorOffset !== 0) {
				if (ValidationUtils.isTextNode(anchorOffsetChar)) {
					let SliceContent = anchorOffsetChar.getSlicedContent(false, selectionState.anchorOffset);
					this.TextNodeSlice(anchorOffsetChar, '', selectionState.anchorOffset);
					CharNodeSlice += 1;
					SlicedCharNode = anchorOffsetChar.createSelfNode({plainText: SliceContent, stylesArr: anchorOffsetChar.returnNodeStyle()});
				} else {
					CharNodeSlice += 1;
					SlicedCharNode = new TextNode();
				}
			}
			let SliceCharNodes = CurrentBlock.NodeData.slice(CharNodeSlice);
			CurrentBlock.splitCharNode(true, CharNodeSlice);


			if (SlicedCharNode !== undefined) {
				SliceCharNodes = [SlicedCharNode, ...SliceCharNodes];
			}

			let newBlockNode = new BlockNode({
				NodeData: SliceCharNodes,
				blockWrapper: CurrentBlock.blockWrapper,
			});

			currentContentNode.insertBlockNodeBetween(newBlockNode, anchorBlockPath.getLastIndex() + 1, anchorBlockPath.getLastIndex() + 1);

			selectionState.moveSelectionToNextSibling(this);
		} else {
			if (selectionState.blockPathIsEqual()) {
				let AnchorBlock = this.getBlockByPath(anchorBlockPath.get()) as BlockNode;
				let currentContentNode: ContentNode = this.getCurrentContentNode(anchorBlockPath);

				let anchorNodeData = AnchorBlock.getNodeByIndex(selectionState.anchorNodeKey);
				let focusNodeData = AnchorBlock.getNodeByIndex(selectionState.focusNodeKey);

				let anchorNodeSlice = selectionState.anchorNodeKey + 1;
				let focusNodeSlice = selectionState.focusNodeKey + 1;
				let SlicedTextNode: undefined | TextNode = undefined;

				if (anchorNodeSlice !== focusNodeSlice) {
					if (ValidationUtils.isTextNode(anchorNodeData)) {
						this.TextNodeSlice(anchorNodeData as TextNode, '', selectionState.anchorOffset);
					} else focusNodeSlice += 1;

					if (ValidationUtils.isTextNode(focusNodeData)) {
						SlicedTextNode = (focusNodeData as TextNode).createSelfNode({
							plainText: (focusNodeData as TextNode).getSlicedContent(false, selectionState.focusOffset),
							stylesArr: (focusNodeData as TextNode).returnNodeStyle(),
						});
						this.TextNodeSlice(focusNodeData as TextNode, '', selectionState.focusOffset, -1);
					} else focusNodeSlice += 1;
				} else {
					if (ValidationUtils.isTextNode(anchorNodeData)) {
						SlicedTextNode = (focusNodeData as TextNode).createSelfNode({
							plainText: (focusNodeData as TextNode).getSlicedContent(false, selectionState.focusOffset),
							stylesArr: (focusNodeData as TextNode).returnNodeStyle(),
						});
						this.TextNodeSlice(anchorNodeData as TextNode, '', selectionState.anchorOffset);
					} else focusNodeSlice += 1;
				}

				let SliceCharNodes = AnchorBlock.NodeData.slice(focusNodeSlice);
				if (SlicedTextNode !== undefined) {
					SliceCharNodes = [SlicedTextNode, ...SliceCharNodes];
				}

				AnchorBlock.splitCharNode(true, anchorNodeSlice);
				SliceCharNodes = SliceCharNodes.length > 0 ? SliceCharNodes : [new TextNode()];

				let NewBlock = new BlockNode({
					NodeData: SliceCharNodes,
					blockType: AnchorBlock.blockType,
				});

				currentContentNode.insertBlockNodeBetween(NewBlock, anchorBlockPath.getLastIndex() + 1, anchorBlockPath.getLastIndex() + 1);

				selectionState.moveSelectionToNextSibling(this);
			} else if (selectionState.blockPathIsEqual() === false) {
				this.removeLetterFromBlock(selectionState);
			}
		}
	}
}
