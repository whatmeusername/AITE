import BlockNode, {HorizontalRuleNode} from './BlockNode';
import {SelectionState, BlockPath} from './SelectionUtils';
import {BREAK_LINE, BREAK_LINE_TYPE, ELEMENT_NODE_TYPE, TEXT_NODE_TYPE, STANDART_BLOCK_TYPE} from './ConstVariables';
import TextNode from './CharNode';
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
				CharData: [new TextNode('Тестовый текст для редактора')],
				blockWrapper: 'header-two',
			}),
			new HorizontalRuleNode(),
			new BlockNode({
				blockWrapper: 'blockquote',
				CharData: [
					new TextNode(
						`Программи́рование — процесс создания компьютерных программ. По выражению одного из основателей языков программирования Никлауса Вирта «Программы = алгоритмы + структуры данных». Программирование основывается на использовании языков программирования, на которых записываются исходные тексты программ.`,
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'header-one',
				CharData: [new TextNode(`Языки программирования`)],
			}),
			new BlockNode({
				CharData: [
					createImageNode({
						src: 'https://i.gifer.com/2GU.gif',
						float: 'right',
					}),
					new TextNode(
						`Большая часть работы программистов связана с написанием исходного кода, тестированием и отладкой программ на одном из языков программирования. Исходные тексты и исполняемые файлы программ являются объектами авторского права и являются интеллектуальной собственностью их авторов и правообладателей.
Различные языки программирования поддерживают различные стили программирования (парадигмы программирования). Выбор нужного языка программирования для некоторых частей алгоритма позволяет сократить время написания программы и решить задачу описания алгоритма наиболее эффективно. Разные языки требуют от программиста различного уровня внимания к деталям при реализации алгоритма, результатом чего часто бывает компромисс между простотой и производительностью (или между «временем программиста» и «временем пользователя»).
Единственный язык, напрямую выполняемый ЭВМ — это машинный язык (также называемый машинным кодом и языком машинных команд). Изначально все программы писались в машинном коде, но сейчас этого практически уже не делается. Вместо этого программисты пишут исходный код на том или ином языке программирования, затем, используя компилятор, транслируют его в один или несколько этапов в машинный код, готовый к исполнению на целевом процессоре, или в промежуточное представление, которое может быть исполнено специальным интерпретатором — виртуальной машиной. Но это справедливо только для языков высокого уровня. Если требуется полный низкоуровневый контроль над системой на уровне машинных команд и отдельных ячеек памяти, программы пишут на языке ассемблера, мнемонические инструкции которого преобразуются один к одному в соответствующие инструкции машинного языка целевого процессора ЭВМ (по этой причине трансляторы с языков ассемблера получаются алгоритмически простейшими трансляторами).
`,
						['ITALIC'],
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'blockquote',
				CharData: [
					new TextNode(
						`В некоторых языках вместо машинного кода генерируется интерпретируемый двоичный код «виртуальной машины», также называемый байт-кодом (byte-code). Такой подход применяется в Forth, некоторых реализациях Lisp, Java, Perl, Python, языках для .NET Framework.`,
					),
				],
			}),
			new HorizontalRuleNode(),
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
			if (currentBlock instanceof BlockNode || currentBlock?.CharData !== undefined) {
				currentBlock = currentBlock.CharData[path[i]];
			} else if (!(currentBlock instanceof BlockNode)) {
				currentBlock = currentBlock.ContentNode !== undefined ? currentBlock.ContentNode.BlockNodes[path[i]] : currentBlock?.CharData[path[i]];
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
						currentBlock = currentBlock.CharData[path[i]];
					} else if (!(currentBlock instanceof BlockNode)) {
						currentBlock = currentBlock?.CharData[path[i]];
					}
				} else currentBlock.splice(path[i], 1);
			}
		}
	}

	TextNodeSlice(char: TextNode, CharToInsert: string = '', start: number, end?: number): void {
		if (start === -1) {
			char.d[1] = char.d[1] + CharToInsert;
		} else if (end !== undefined && end !== -1) {
			char.d[1] = char.d[1].slice(0, start) + CharToInsert + char.d[1].slice(end);
		} else if (end === -1) {
			char.d[1] = char.d[1].slice(start) + CharToInsert;
		} else {
			char.d[1] = char.d[1].slice(0, start) + CharToInsert;
		}
	}

	MergeWithUpdate(
		BlockNodes: Array<BlockType> | ContentNode,
		selectionState: SelectionState,
		joiningBlockDirection: 'up' | 'down',
		joiningSideDirection: 'left' | 'right',
	): void {
		let AnchorIndex = new BlockPath([...selectionState.anchorKey.get()]);
		let lastInConnectingChar = undefined;
		let anchorCharKey = 0;
		let newAnchorOffset = 0;
		let connectingBlockLength = 0;

		if (joiningSideDirection === 'left') {
			joiningBlockDirection === 'down' ? AnchorIndex.decrementLastPathIndex(1) : AnchorIndex.incrementLastPathIndex(1);

			let connectingBlock = this.getBlockByPath(selectionState.anchorKey.get()) as BlockNode;

			connectingBlockLength = connectingBlock.lastNodeIndex() + 1;
			lastInConnectingChar = connectingBlock.CharData[connectingBlockLength - 1];
			let connectingMaxSize = connectingBlock.countToIndex(connectingBlockLength - 1);

			let joiningBlock = this.getBlockByPath(AnchorIndex.get()) as BlockNode;

			connectingBlock.CharData = [...connectingBlock.CharData, ...joiningBlock.CharData];
			connectingBlock.blockUpdate();

			if (BlockNodes instanceof ContentNode) BlockNodes.BlockNodes.splice(AnchorIndex.getLastIndex(), 1);
			else BlockNodes.splice(AnchorIndex.getLastIndex(), 1);

			if (connectingBlock.CharData.length < connectingBlockLength) {
				let updateAnchorChar = connectingBlock.findNodeByOffset(connectingMaxSize);
				anchorCharKey = updateAnchorChar.offsetKey;
				newAnchorOffset = updateAnchorChar.letterIndex;
			} else {
				anchorCharKey = selectionState.anchorCharKey + connectingBlockLength - 1;
				newAnchorOffset = selectionState.anchorOffset;
			}
		} else {
			joiningBlockDirection === 'down' ? AnchorIndex.decrementLastPathIndex(1) : AnchorIndex.incrementLastPathIndex(1);

			let connectingBlock = this.getBlockByPath(selectionState.anchorKey.get()) as BlockNode;
			let joiningBlock = this.getBlockByPath(AnchorIndex.get()) as BlockNode;

			connectingBlockLength = connectingBlock.lastNodeIndex() + 1;

			lastInConnectingChar = connectingBlock.CharData[connectingBlockLength - 1];

			connectingBlock.CharData = [...connectingBlock.CharData, ...joiningBlock.CharData];

			connectingBlock.blockUpdate();
			if (BlockNodes instanceof ContentNode) BlockNodes.BlockNodes.splice(AnchorIndex.getLastIndex(), 1);
			else BlockNodes.splice(AnchorIndex.getLastIndex(), 1);

			newAnchorOffset = selectionState.anchorOffset;
			anchorCharKey = selectionState.anchorCharKey;
			AnchorIndex.decrementLastPathIndex(1);
		}

		selectionState.focusKey = joiningSideDirection !== 'left' ? AnchorIndex : selectionState.anchorKey;
		selectionState.anchorKey = joiningSideDirection !== 'left' ? AnchorIndex : selectionState.anchorKey;

		selectionState.anchorCharKey = anchorCharKey;
		selectionState.focusCharKey = selectionState.anchorCharKey;

		selectionState._anchorNode = selectionState.anchorCharKey;
		selectionState._focusNode = selectionState.anchorCharKey;

		selectionState.anchorOffset = newAnchorOffset;
		selectionState.focusOffset = newAnchorOffset;

		selectionState.anchorType = lastInConnectingChar.returnType() !== 'text' ? 'element' : 'text';
		selectionState.focusType = lastInConnectingChar.returnType() !== 'text' ? 'element' : 'text';

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

		let anchorBlockNode = this.getBlockByPath(selectionState.anchorKey.get()) as BlockNode;
		let focusBlockNode = this.getBlockByPath(selectionState.focusKey.get()) as BlockNode;

		let CurrentAnchorCharData = anchorBlockNode.CharData !== undefined ? anchorBlockNode.CharData[selectionState.anchorCharKey] : undefined;
		let CurrentFocusCharData = focusBlockNode.CharData !== undefined ? focusBlockNode.CharData[selectionState.focusCharKey] : undefined;

		if (selectionState.isCollapsed) {
			let SliceFrom = selectionState.anchorOffset;
			let SliceTo = selectionState.focusOffset;

			if (ValidationUtils.isTextNode(CurrentAnchorCharData) === true) {
				if (Key === ' ' && KeyBoardEvent.which === 229) {
					Key = '. ';
					SliceFrom -= 1;
				}

				this.TextNodeSlice(CurrentAnchorCharData as TextNode, Key, SliceFrom, SliceTo);
				if (selectionState.anchorType === BREAK_LINE_TYPE) {
					selectionState.convertBreakLineToText();
					selectionState.moveSelectionForward();
				} else {
					selectionState.moveSelectionForward();
				}
			} else {
				let nextNode = anchorBlockNode.nextSibling(selectionState.anchorCharKey) as TextNode;
				if (nextNode === undefined || ValidationUtils.isTextNode(nextNode) === false) {
					let nextNode = new TextNode();
					anchorBlockNode.splitCharNode(true, selectionState.anchorCharKey + 1, selectionState.focusCharKey + 1, nextNode);
					this.TextNodeSlice(nextNode, Key, 0, 0);
					selectionState.toggleCollapse(true);
					selectionState.moveSelectionForward();
					selectionState.isDirty = true;
				} else if (ValidationUtils.isTextNode(nextNode) === true) {
					this.TextNodeSlice(nextNode, Key, 0, 0);
					selectionState.toggleCollapse(true);
					selectionState.isDirty = true;
				}
			}
		} else if (selectionState.pathIsEqual() === true) {
			if (selectionState.anchorCharKey !== selectionState.focusCharKey) {
				let CharSplitStart = selectionState.anchorCharKey + 1;
				let CharSplitEnd = selectionState.focusCharKey;

				if (ValidationUtils.isTextNode(CurrentAnchorCharData)) {
					this.TextNodeSlice(CurrentAnchorCharData as TextNode, Key, selectionState.anchorOffset);
				} else {
					let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorCharKey);
					if (previousSibling !== undefined && ValidationUtils.isTextNode(previousSibling) === true) {
						this.TextNodeSlice(previousSibling as TextNode, Key, -1);
					} else anchorBlockNode.splitCharNode(true, CharSplitStart, CharSplitStart + 1, new TextNode());
					CharSplitStart -= 1;
				}

				if (ValidationUtils.isTextNode(CurrentFocusCharData)) {
					this.TextNodeSlice(CurrentFocusCharData as TextNode, '', selectionState.focusOffset, -1);
				} else CharSplitEnd += 1;

				anchorBlockNode.splitCharNode(true, CharSplitStart, CharSplitEnd);

				selectionState.moveSelectionForward();
				selectionState.toggleCollapse();
			} else {
				if (ValidationUtils.isTextNode(CurrentAnchorCharData)) {
					CurrentAnchorCharData = CurrentAnchorCharData as TextNode;
					this.TextNodeSlice(CurrentAnchorCharData, Key, selectionState.anchorOffset, selectionState.focusOffset);

					if (CurrentAnchorCharData.returnContent() === '') {
						anchorBlockNode.splitCharNode(true, selectionState.anchorCharKey);
						selectionState.moveSelectionToPreviousSibling(this);
					} else {
						selectionState.toggleCollapse();
						selectionState.moveSelectionForward();
					}
				} else {
					anchorBlockNode.splitCharNode(false, selectionState.anchorCharKey, selectionState.anchorCharKey + 1);
				}
			}
		} else if (selectionState.pathIsEqual() === false) {
			let CharSplitStart = selectionState.anchorCharKey + 1;
			let CharSplitEnd = selectionState.focusCharKey;

			if (CurrentAnchorCharData !== undefined) {
				if (ValidationUtils.isTextNode(CurrentAnchorCharData)) {
					this.TextNodeSlice(CurrentAnchorCharData as TextNode, Key, selectionState.anchorOffset);
				} else {
					let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorCharKey);
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

			if (CurrentFocusCharData !== undefined) {
				if (ValidationUtils.isTextNode(CurrentFocusCharData)) {
					this.TextNodeSlice(CurrentFocusCharData as TextNode, CurrentAnchorCharData === undefined ? Key : '', selectionState.focusOffset, -1);
				} else {
					CharSplitEnd += 1;
				}

				focusBlockNode.bulkRemoveCharNode(false, CharSplitEnd, undefined);
			}

			if (selectionState.anchorKey.length() === 1) {
				this.sliceBlockFromContent(selectionState.anchorKey.getPathIndexByIndex(0) + 1, selectionState.focusKey.getPathIndexByIndex(0));
			} else {
				let blockWrapper = this.getBlockByPath(selectionState.anchorKey.getPathBeforeLast());
				blockWrapper.ContentNode
					? blockWrapper.ContentNode.sliceBlockFromContent(
							selectionState.anchorKey.getPathIndexByIndex(0) + 1,
							selectionState.focusKey.getPathIndexByIndex(0),
					  )
					: (blockWrapper.CharData = [
							...blockWrapper.CharData.slice(0, selectionState.anchorKey.getPathIndexByIndex(0) + 1),
							...blockWrapper.CharData.slice(selectionState.focusKey.getPathIndexByIndex(0)),
					  ]);
			}

			if (CurrentFocusCharData !== undefined && CurrentAnchorCharData !== undefined) {
				let blocksArray = [];
				if (selectionState.anchorKey.length() === 1) {
					blocksArray = this.BlockNodes;
				} else {
					blocksArray = this.getBlockByPath(selectionState.anchorKey.getPathBeforeLast());
				}
				this.MergeWithUpdate(blocksArray.ContentNode ? blocksArray.ContentNode : blocksArray, selectionState, 'up', 'right');
				selectionState.moveSelectionForward();
			} else if (CurrentAnchorCharData !== undefined) selectionState.moveSelectionForward();
			else if (CurrentFocusCharData !== undefined) {
				selectionState.focusOffset = 0;
				selectionState.toggleCollapse(true);
			}
		}
	}
	removeLetterFromBlock(selectionState: SelectionState): void {
		let anchorBlockNode = this.getBlockByPath(selectionState.anchorKey.get()) as BlockNode;
		let focusBlockNode = this.getBlockByPath(selectionState.focusKey.get()) as BlockNode;

		if (selectionState.isFullBlockSelected() === true) {
			let SliceAnchor = selectionState.anchorKey;
			this.sliceBlockFromContent(SliceAnchor.getLastIndex(), SliceAnchor.getLastIndex() + 1);

			selectionState.moveSelectionToPreviousSibling(this);
		}

		let anchorCharNode = anchorBlockNode.CharData ? anchorBlockNode.CharData[selectionState.anchorCharKey] : undefined;
		let focusCharNode = focusBlockNode.CharData ? focusBlockNode.CharData[selectionState.focusCharKey] : undefined;

		if (anchorCharNode === undefined && focusCharNode === undefined) return;
		else if (selectionState.isCollapsed) {
			if (selectionState.anchorCharKey === 0 && selectionState.anchorOffset === 0) {
				let currentContentNode = undefined;
				if (selectionState.anchorKey.length() === 1) currentContentNode = this;
				else currentContentNode = this.getBlockByPath(selectionState.anchorKey.getPathBeforeLast());

				currentContentNode = currentContentNode.ContentNode ?? currentContentNode;

				if (selectionState.anchorKey.getLastIndex() !== 0 && currentContentNode instanceof ContentNode) {
					let previousBlockPath = new BlockPath(selectionState.anchorKey.get());
					previousBlockPath.decrementLastPathIndex(1);

					let previousBlock = currentContentNode.BlockNodes[previousBlockPath.getLastIndex()] as BlockNode;

					if (previousBlock.getType() !== STANDART_BLOCK_TYPE) {
						currentContentNode.sliceBlockFromContent(selectionState.anchorKey.getLastIndex(), selectionState.anchorKey.getLastIndex() + 1);
						selectionState.toggleCollapse();
						selectionState.convertBreakLineToText();
					} else {
						this.MergeWithUpdate(currentContentNode.BlockNodes, selectionState, 'up', 'left');
					}
				}
			} else {
				if (anchorCharNode === undefined || anchorBlockNode === undefined) return;
				let SliceAnchor = selectionState.anchorOffset - 1;
				let SliceFocus = selectionState.focusOffset;
				let anchorCharType = anchorCharNode.returnType();

				if (selectionState.anchorOffset === 0) {
					if (anchorBlockNode.previousSibling(selectionState.anchorCharKey)?.returnType() === ELEMENT_NODE_TYPE) {
						anchorBlockNode.removeCharNode(selectionState.anchorCharKey - 1);
						selectionState.anchorCharKey -= 1;
						selectionState.toggleCollapse();
						selectionState.isDirty = true;
					}
				} else if (anchorCharType === TEXT_NODE_TYPE) {
					anchorCharNode = anchorCharNode as TextNode;
					this.TextNodeSlice(anchorCharNode, '', SliceAnchor, SliceFocus);

					if (anchorBlockNode.lastNodeIndex() > 0 && anchorCharNode.returnContent() === '') {
						anchorBlockNode.CharData.splice(selectionState.anchorCharKey, 1);
						selectionState.moveSelectionToPreviousSibling(this);
					} else {
						selectionState.moveSelectionBack();
						if (anchorBlockNode.lastNodeIndex() === 0 && anchorCharNode.returnContentLength() === 0) {
							selectionState.isDirty = true;
						}
					}
				}
			}
		} else {
			if (selectionState.pathIsEqual() === true) {
				if (selectionState.anchorCharKey === selectionState.focusCharKey) {
					if (ValidationUtils.isTextNode(anchorCharNode)) {
						anchorCharNode = anchorCharNode as TextNode;

						let SliceAnchor = selectionState.anchorOffset;
						let SliceFocus = selectionState.focusOffset;

						this.TextNodeSlice(anchorCharNode, '', SliceAnchor, SliceFocus);

						if (anchorCharNode.returnContent() === '') {
							anchorBlockNode.CharData.splice(selectionState.anchorCharKey, 1);
							selectionState.moveSelectionToPreviousSibling(this);
						} else selectionState.toggleCollapse();
					} else {
						anchorBlockNode.CharData.splice(selectionState.anchorCharKey, 1);
						selectionState.moveSelectionToPreviousSibling(this);
					}
				} else if (selectionState.anchorCharKey !== selectionState.focusCharKey) {
					let SliceAnchor = selectionState.anchorOffset;
					let SliceFocus = selectionState.focusOffset;

					let CharSliceAnchor = selectionState.anchorCharKey + 1;
					let CharSliceFocus = selectionState.focusCharKey;

					if (ValidationUtils.isTextNode(anchorCharNode)) {
						anchorCharNode = anchorCharNode as TextNode;
						this.TextNodeSlice(anchorCharNode, '', SliceAnchor);
						if (anchorCharNode.returnContent() === '') {
							CharSliceAnchor -= 1;
							selectionState.moveSelectionToPreviousSibling(this);
						} else {
							selectionState.toggleCollapse();
							selectionState.isDirty = true;
						}
					} else {
						CharSliceFocus -= 1;
						selectionState.moveSelectionToPreviousSibling(this);
					}

					if (ValidationUtils.isTextNode(focusCharNode)) {
						focusCharNode = focusCharNode as TextNode;
						this.TextNodeSlice(focusCharNode, '', SliceFocus, -1);
						if (focusCharNode.returnContent() === '') CharSliceFocus += 1;
					} else CharSliceFocus += 1;

					anchorBlockNode.splitCharNode(true, CharSliceAnchor, CharSliceFocus);
				}
			} else if (selectionState.pathIsEqual() === false) {
				let SliceAnchor = selectionState.anchorOffset;
				let SliceFocus = selectionState.focusOffset;

				let BlockSliceAnchor = selectionState.anchorKey.getLastIndex() + 1;
				let BlockSliceFocus = selectionState.focusKey.getLastIndex();

				let CharSliceAnchor = selectionState.anchorCharKey + 1;
				let CharSliceFocus = selectionState.focusCharKey;

				anchorCharNode = anchorCharNode as TextNode;
				focusCharNode = focusCharNode as TextNode;

				if (anchorCharNode === undefined) BlockSliceAnchor -= 1;
				else {
					if (ValidationUtils.isTextNode(anchorCharNode)) {
						anchorCharNode = anchorCharNode as TextNode;
						this.TextNodeSlice(anchorCharNode, '', SliceAnchor);
						if (anchorCharNode.returnContent() === '') {
							CharSliceAnchor -= 1;
							selectionState.moveSelectionToPreviousSibling(this);
						} else {
							selectionState.toggleCollapse();
							selectionState.isDirty = true;
						}
					} else {
						CharSliceAnchor -= 1;
						selectionState.moveSelectionToPreviousSibling(this);
					}
					anchorBlockNode.bulkRemoveCharNode(true, CharSliceAnchor);
				}

				if (focusCharNode !== undefined) {
					if (ValidationUtils.isTextNode(focusCharNode)) {
						focusCharNode = focusCharNode as TextNode;
						this.TextNodeSlice(focusCharNode, '', SliceFocus, -1);
						if (focusCharNode.returnContent() === '') CharSliceFocus += 1;
					} else CharSliceFocus += 1;
					focusBlockNode.bulkRemoveCharNode(false, CharSliceFocus);
				}

				if (selectionState.anchorKey.length() > 1) {
					let ParentNode = this.getBlockByPath(selectionState.anchorKey.getPathBeforeLast());

					if (ParentNode.ContentNode instanceof ContentNode) {
						ParentNode.ContentNode.sliceBlockFromContent(BlockSliceAnchor, BlockSliceFocus);
						this.MergeWithUpdate(ParentNode.ContentNode, selectionState, 'up', 'left');
					}
				} else {
					this.sliceBlockFromContent(BlockSliceAnchor, BlockSliceFocus);
					this.MergeWithUpdate(this.BlockNodes, selectionState, 'up', 'left');
				}
			}
		}
	}
	handleEnter(selectionState: SelectionState): void {
		let anchorPath = selectionState.anchorKey;

		if (
			selectionState.anchorCharKey === 0 &&
			selectionState.anchorOffset === 0 &&
			selectionState.focusOffset === 0 &&
			(selectionState.anchorNode as HTMLElement)?.tagName !== BREAK_LINE
		) {
			this.getCurrentContentNode(anchorPath).insertBlockNodeBetween(
				new BlockNode({CharData: [new TextNode()]}),
				anchorPath.getLastIndex(),
				anchorPath.getLastIndex(),
			);
			selectionState.moveSelectionToNextSibling(this);
		} else if (selectionState.isCollapsed) {
			let CurrentBlock = this.getBlockByPath(anchorPath.get());
			let anchorOffsetChar = CurrentBlock.findCharByIndex(selectionState.anchorCharKey) as TextNode;

			let CharNodeSlice = selectionState.anchorCharKey;
			let SlicedCharNode = undefined;
			let currentContentNode: ContentNode = this.getCurrentContentNode(anchorPath);

			if (selectionState.anchorOffset !== 0) {
				if (ValidationUtils.isTextNode(anchorOffsetChar)) {
					let SliceContent = anchorOffsetChar.getSlicedContent(false, selectionState.anchorOffset);
					this.TextNodeSlice(anchorOffsetChar, '', selectionState.anchorOffset);
					CharNodeSlice += 1;
					SlicedCharNode = new TextNode(SliceContent, anchorOffsetChar.returnNodeStyle());
				} else {
					CharNodeSlice += 1;
					SlicedCharNode = new TextNode();
				}
			}
			let SliceCharNodes = CurrentBlock.CharData.slice(CharNodeSlice);
			CurrentBlock.splitCharNode(true, CharNodeSlice);

			if (SlicedCharNode !== undefined) {
				SliceCharNodes = [SlicedCharNode, ...SliceCharNodes];
			}

			let newBlockNode = new BlockNode({
				CharData: SliceCharNodes,
				blockWrapper: CurrentBlock.blockWrapper,
			});

			currentContentNode.insertBlockNodeBetween(newBlockNode, anchorPath.getLastIndex() + 1, anchorPath.getLastIndex() + 1);

			selectionState.moveSelectionToNextSibling(this);
		} else {
			if (selectionState.pathIsEqual()) {
				let AnchorBlock = this.getBlockByPath(anchorPath.get()) as BlockNode;
				let currentContentNode: ContentNode = this.getCurrentContentNode(anchorPath);

				let anchorCharNode = AnchorBlock.getNodeByIndex(selectionState.anchorCharKey);
				let focusCharNode = AnchorBlock.getNodeByIndex(selectionState.focusCharKey);

				let anchorNodeSlice = selectionState.anchorCharKey + 1;
				let focusNodeSlice = selectionState.focusCharKey + 1;
				let SlicedTextNode: undefined | TextNode = undefined;

				if (anchorNodeSlice !== focusNodeSlice) {
					if (ValidationUtils.isTextNode(anchorCharNode)) {
						this.TextNodeSlice(anchorCharNode as TextNode, '', selectionState.anchorOffset);
					} else focusNodeSlice += 1;

					if (ValidationUtils.isTextNode(focusCharNode)) {
						SlicedTextNode = new TextNode(
							(focusCharNode as TextNode).getSlicedContent(false, selectionState.focusOffset),
							(focusCharNode as TextNode).returnNodeStyle(),
						);
						this.TextNodeSlice(focusCharNode as TextNode, '', selectionState.focusOffset, -1);
					} else focusNodeSlice += 1;
				} else {
					if (ValidationUtils.isTextNode(anchorCharNode)) {
						SlicedTextNode = new TextNode(
							(focusCharNode as TextNode).getSlicedContent(false, selectionState.focusOffset),
							(focusCharNode as TextNode).returnNodeStyle(),
						);
						this.TextNodeSlice(anchorCharNode as TextNode, '', selectionState.anchorOffset);
					} else focusNodeSlice += 1;
				}

				let SliceCharNodes = AnchorBlock.CharData.slice(focusNodeSlice);
				if (SlicedTextNode !== undefined) {
					SliceCharNodes = [SlicedTextNode, ...SliceCharNodes];
				}

				AnchorBlock.splitCharNode(true, anchorNodeSlice);
				SliceCharNodes = SliceCharNodes.length > 0 ? SliceCharNodes : [new TextNode()];

				let NewBlock = new BlockNode({
					CharData: SliceCharNodes,
					blockType: AnchorBlock.blockType,
				});

				currentContentNode.insertBlockNodeBetween(NewBlock, anchorPath.getLastIndex() + 1, anchorPath.getLastIndex() + 1);

				selectionState.moveSelectionToNextSibling(this);
			} else if (selectionState.pathIsEqual() === false) {
				this.removeLetterFromBlock(selectionState);
			}
		}
	}
}
