
import {BREAK_LINE_TYPE, ELEMENT_NODE_TYPE} from './ConstVariables';
import {TextNode, createLinkNode, createTextNode, BreakLine, LinkNode} from './AITE_nodes/index'
import {createImageNode} from './packages/AITE_Image/imageNode';
import type {imageNode} from './packages/AITE_Image/imageNode'

import {NodeTypes} from './BlockNode'


import {
	unmountNode,
	BlockType,
	SelectionState,
	NodePath,
	BlockNode, 
	HorizontalRuleNode,
	getSelectionState,
	mountNode,
} from './index'
import {isDefined, isDecoratorNode} from './EditorUtils'


interface contentNodeConf {
	BlockNodes?: Array<BlockType>;
}

//eslint-disable-next-line



function createContentNode(initData?: contentNodeConf){
	return new ContentNode(initData)
}

class ContentNode {
	blocksLength: () => number;
	BlockNodes: Array<BlockType>;

	constructor(initData?: contentNodeConf) {
		this.blocksLength = () => {
			return this.BlockNodes.length;
		};
		this.BlockNodes = initData?.BlockNodes ?? [
			new BlockNode({
				_children: [createTextNode('Тестовый текст для редактора', [])],
				blockWrapper: 'header-two',
			}),
			new HorizontalRuleNode(),
			new BlockNode({
				blockWrapper: 'standart',
				_children: [
					new TextNode(
						{plainText: `Программи́рование — процесс создания компьютерных программ. По выражению одного из основателей языков программирования Никлауса Вирта «Программы = алгоритмы + структуры данных». Программирование основывается на использовании языков программирования, на которых записываются исходные тексты программ.`}
					),
				],
				
			}),
			new BlockNode({
				blockWrapper: 'header-one',
				_children: [
					createTextNode(`Языки программирования`, ['STRIKETHROUGH', 'UNDERLINE']),
					createLinkNode('https://yandex.ru').append(
						createTextNode(` часть ссылки`, ['ITALIC', 'UNDERLINE']),
						createTextNode(` вторая часть ссылки`, []),
					),
					createTextNode(` текст после ссылки`, ['ITALIC', 'UNDERLINE']),
				],
			}),
			new BlockNode({
				blockWrapper: 'header-six',
				_children: [
					createTextNode(`совсем `),
					createTextNode(`не видимый `, ['ITALIC']),
					createTextNode(`текст`),
				],
			}),
			new BlockNode({
				blockWrapper: 'standart',
				_children: [new BreakLine() as any]
			}),
			new BlockNode({
				_children: [
					createImageNode({
						src: 'https://i.gifer.com/2GU.gif',
						captionEnabled: true,
					}) as imageNode,
					createTextNode(
						`Большая часть работы программистов связана с написанием исходного кода, тестированием и отладкой программ на одном из языков программирования. Исходные тексты и исполняемые файлы программ являются объектами авторского права и являются интеллектуальной собственностью их авторов и правообладателей.
		Различные языки программирования поддерживают различные стили программирования (парадигмы программирования). Выбор нужного языка программирования для некоторых частей алгоритма позволяет сократить время написания программы и решить задачу описания алгоритма наиболее эффективно. Разные языки требуют от программиста различного уровня внимания к деталям при реализации алгоритма, результатом чего часто бывает компромисс между простотой и производительностью (или между «временем программиста» и «временем пользователя»).
		Единственный язык, напрямую выполняемый ЭВМ — это машинный язык (также называемый машинным кодом и языком машинных команд). Изначально все программы писались в машинном коде, но сейчас этого практически уже не делается. Вместо этого программисты пишут исходный код на том или ином языке программирования, затем, используя компилятор, транслируют его в один или несколько этапов в машинный код, готовый к исполнению на целевом процессоре, или в промежуточное представление, которое может быть исполнено специальным интерпретатором — виртуальной машиной. Но это справедливо только для языков высокого уровня. Если требуется полный низкоуровневый контроль над системой на уровне машинных команд и отдельных ячеек памяти, программы пишут на языке ассемблера, мнемонические инструкции которого преобразуются один к одному в соответствующие инструкции машинного языка целевого процессора ЭВМ (по этой причине трансляторы с языков ассемблера получаются алгоритмически простейшими трансляторами).
		`
					),
				]}),
			new BlockNode({
				blockWrapper: 'blockquote',
				_children: [
					createTextNode(
						`В некоторых языках вместо машинного кода генерируется интерпретируемый двоичный код «виртуальной машины», также называемый байт-кодом (byte-code). Такой подход применяется в Forth, некоторых реализациях Lisp, Java, Perl, Python, языках для .NET Framework.`,
					),
				],
			}),
			new HorizontalRuleNode(),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				_children: [
					createTextNode(`предмет листа 1`),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				_children: [
					createTextNode(`предмет листа 2`),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				_children: [
					createTextNode(`предмет листа 3`),
				],
			}),
			new BlockNode({
				blockWrapper: 'header-five',
				_children: [
					createTextNode(`предмет листа 4`),
					createImageNode({
						src: 'https://i.gifer.com/2GU.gif',
						captionEnabled: true,
					}) as imageNode
				],
			}),
			new BlockNode({
				blockWrapper: 'list-unordered-item',
				_children: [
					createTextNode(`предмет листа 5`),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				_children: [
					createTextNode(`предмет листа 5`),
				],
			}),
		];
	}


	removeDomNodes(startFromZero: boolean = true, start: number, end?: number): void{
		let slicedNodes: Array<BlockType> = []
		if (end === undefined) {
			if (startFromZero === false) {
				slicedNodes = this.BlockNodes.slice(0, start);
				this.BlockNodes = this.BlockNodes.slice(start);
			}
			else if (startFromZero === true){
				slicedNodes = this.BlockNodes.slice(start);
				this.BlockNodes = this.BlockNodes.slice(0, start);
			}
		} else if (end !== undefined) {
			if(startFromZero === false){
				slicedNodes = [...this.BlockNodes.slice(0, start), ...this.BlockNodes.slice(end)];
				this.BlockNodes = this.BlockNodes.slice(start, end);
			}
			else{
				slicedNodes = this.BlockNodes.slice(start, end);
				this.BlockNodes = [...this.BlockNodes.slice(0, start), ...this.BlockNodes.slice(end)];
			}
		}
		if(slicedNodes.length > 0){
			slicedNodes.forEach((node: BlockType) => {
				unmountNode(node)
			})
		}
	}

	insertNodeBefore(index: number, node: BlockType): BlockType{
		let insertOffset = index > 0 ? index - 1 : index
		let previousSibling = this.BlockNodes[index]
		this.insertBlockNodeBetween(node, insertOffset, insertOffset)

		if(previousSibling) mountNode(previousSibling, node, 'before')
		return node
	}

	insertNodeAfter(index: number, node: BlockType): BlockType{
		let insertOffset = index + 1
		let previousSibling = this.BlockNodes[index]

		this.insertBlockNodeBetween(node, insertOffset, insertOffset)
		if(previousSibling) mountNode(previousSibling, node, 'before')
		return node
	}

	insertNode(node: BlockType, index: number | 'last' | 'first', direction: 'before' | 'after'){
		index = index >= 0 ? index : 0
		let blocksLength = this.BlockNodes.length - 1
		if(index === 0 || index === 'first'){
			this.insertNodeBefore(0, node)
		}
		else if(index === blocksLength || index === 'last'){
			this.insertNodeAfter(blocksLength, node)
		}
		else{
			let previousSibling = this.BlockNodes[index + 1]
			this.insertBlockNodeBetween(node, index, index + 1)
			if(previousSibling) mountNode(previousSibling, node, direction)
		}
	}

	/**
	 * Searching for ContentNode using NodePath in main ContentNode or returning self
	 * @param  {NodePath} NodePath
	 * @returns ContentNode
	 */
	getCurrentContentNode(NodePath: NodePath): ContentNode {
		if (NodePath.length() !== 1) {
			let currentContentNode = this.getBlockByPath(NodePath.getContentNode()) as any;
			if (currentContentNode instanceof ContentNode) return currentContentNode;
			else if (currentContentNode.ContentNode !== undefined) return currentContentNode.ContentNode;
		}
		return this;
	}
	/**
	 * Searching BlockNode using NodePath 
	 * @param  {Array<number>} path
	 */
	getBlockByPath(path: Array<number>) {
		
			
		if(path.length === 0){
			return this
		}
		else if(path.length === 1){
			return this.BlockNodes[path[0]];
		}
		else{
			let currentBlock: any = this.BlockNodes[path[0]];
			for (let i = 1; i < path.length; i++) {
				if (currentBlock instanceof BlockNode || currentBlock?._children !== undefined) {
					currentBlock = currentBlock._children[path[i]];
				} else if (!(currentBlock instanceof BlockNode)) {
					currentBlock = currentBlock.ContentNode !== undefined ? currentBlock.ContentNode.BlockNodes[path[i]] : currentBlock?._children[path[i]];
				}
			}
			return currentBlock;
		}
	}

	getBlockByKeyPath(keyPath: Array<string>): ContentNode | BlockType | undefined {
		
		if(keyPath.length === 0){
			return this
		}
		else if(keyPath.length === 1){
			return this.BlockNodes[this.BlockNodes.findIndex(obj => obj.$getNodeKey() === keyPath[0])]
		}
		else{
			let index = this.BlockNodes.findIndex(obj => obj.$getNodeKey() === keyPath[0])
			let currentNode: any = this.BlockNodes[index];

			for (let i = 1; i < keyPath.length; i++) {
				if(currentNode instanceof BlockNode){
					let index = currentNode._children.findIndex(obj => obj.$getNodeKey() === keyPath[i])
					currentNode = currentNode._children[index];
				}
				else if(currentNode instanceof ContentNode){
					let index = currentNode.BlockNodes.findIndex(obj => obj.$getNodeKey() === keyPath[i])
					currentNode = currentNode.BlockNodes[index];
				}
				else if(currentNode && !(currentNode instanceof BlockNode) && !(currentNode instanceof ContentNode)){
					if(currentNode.ContentNode){
						let index = currentNode.ContentNode.BlockNodes.findIndex((obj: BlockNode) => obj.$getNodeKey() === keyPath[i])
						currentNode = currentNode.ContentNode.BlockNodes[index];
					}
					else if(currentNode.getChildren){
						let index = currentNode.getChildren().findIndex((obj: BlockNode) => obj.$getNodeKey() === keyPath[i])
						currentNode = currentNode.getChildren()[index];
					}
				}
				else return undefined
				
			}
			return currentNode
		}
	}

	// TODO: MOVE TO TextNode
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

	MergeBlocks(
		BlockNodes: Array<BlockType> | ContentNode,
		joiningBlockDirection: 'up' | 'down',
		joiningSideDirection: 'backward' | 'forward',
	): void {
		const selectionState = getSelectionState()
		let AnchorIndex = new NodePath([...selectionState.anchorPath.get()]);
		let lastConnectingNode = undefined;

		let anchorNodeIndex = 0;
		let anchorNodeKey = undefined;

		let newAnchorOffset = selectionState.anchorOffset;
		let connectingBlockLength = 0;



		if (joiningSideDirection === 'backward') {

			let connectingBlock = this.getBlockByPath(selectionState.anchorPath.getBlockPath()) as BlockNode;

			if(isDecoratorNode(connectingBlock)){
				connectingBlock = this.getBlockByPath(selectionState.anchorPath.getContentNode()) as BlockNode;
				AnchorIndex = new NodePath([...selectionState.anchorPath.getBlockPath()]);
			}

			joiningBlockDirection === 'down' ? AnchorIndex.addOrRemoveToBlock('dec', 1) : AnchorIndex.addOrRemoveToBlock('inc', 1);
			const joiningBlock = this.getBlockByPath(AnchorIndex.getBlockPath()) as BlockNode;

			if(isDecoratorNode(joiningBlock)){
				connectingBlock = this.getBlockByPath(AnchorIndex.getContentNode()) as BlockNode;
				AnchorIndex = new NodePath(AnchorIndex.getBlockPath());

				joiningBlockDirection === 'down' ? AnchorIndex.addOrRemoveToBlock('inc', 1) : AnchorIndex.addOrRemoveToBlock('dec', 1);
				joiningBlockDirection === 'down' ? AnchorIndex.addOrRemoveToNode('dec', 1) : AnchorIndex.addOrRemoveToNode('inc', 1);
			}

			connectingBlockLength = connectingBlock.lastNodeIndex() + 1;
			lastConnectingNode = connectingBlock.getLastChild()
			const lastConnectingNodeLength = lastConnectingNode.getContentLength();
			const connectingMaxSize = connectingBlock.countToIndex(connectingBlockLength - 1);


			connectingBlock._children = [...connectingBlock._children, ...joiningBlock._children];

			if (BlockNodes instanceof ContentNode) BlockNodes.BlockNodes.splice(AnchorIndex.getBlockIndex(), 1);
			else BlockNodes.splice(AnchorIndex.getBlockIndex(), 1);

			joiningBlock.remove()
			connectingBlock.remount()

			if (connectingBlock._children.length <= connectingBlockLength) {
				let updatexAnchorNode = connectingBlock.findNodeByOffset(connectingMaxSize);

				anchorNodeIndex = updatexAnchorNode.offsetKey;
				newAnchorOffset = updatexAnchorNode.letterIndex;
				anchorNodeKey = updatexAnchorNode.key
			} else {
				anchorNodeIndex = connectingBlockLength - 1;
				newAnchorOffset = lastConnectingNodeLength;
				anchorNodeKey = connectingBlock.getChildrenByIndex(anchorNodeIndex).$getNodeKey()
			}
		} 
		else {

			let connectingBlock = this.getBlockByPath(selectionState.anchorPath.getBlockPath()) as BlockNode;
			const isDecoratNode = isDecoratorNode(connectingBlock)

			if(isDecoratNode){
				anchorNodeKey = connectingBlock.getLastChild().$getNodeKey()
				connectingBlock = this.getBlockByPath(selectionState.anchorPath.getContentNode()) as BlockNode;
				AnchorIndex = new NodePath([...selectionState.anchorPath.getBlockPath()]);
			}

			joiningBlockDirection === 'down' ? AnchorIndex.addOrRemoveToBlock('dec', 1) : AnchorIndex.addOrRemoveToBlock('inc', 1);
			const joiningBlock = this.getBlockByPath(AnchorIndex.getBlockPath()) as BlockNode;

			lastConnectingNode = connectingBlock.getLastChild()
			connectingBlock._children = [...connectingBlock._children, ...joiningBlock._children];

			if (BlockNodes instanceof ContentNode){
				BlockNodes.removeBlock(AnchorIndex.getBlockIndex());
			}
			else BlockNodes.splice(AnchorIndex.getBlockIndex(), 1);


			joiningBlock.remove()
			connectingBlock.remount()

			anchorNodeIndex = selectionState.anchorPath.getLastIndex();
			anchorNodeKey = isDecoratNode ? anchorNodeKey : connectingBlock.getChildrenByIndex(anchorNodeIndex).$getNodeKey()

			AnchorIndex.addOrRemoveToBlock('dec', 1);
		}


		selectionState.setAnchorKey(anchorNodeKey)
		selectionState.setFocusKey(anchorNodeKey)

		selectionState.focusPath = joiningSideDirection !== 'backward' ? AnchorIndex : selectionState.anchorPath;
		selectionState.anchorPath = joiningSideDirection !== 'backward' ? AnchorIndex : selectionState.anchorPath;

		selectionState.anchorPath.setLastPathIndex(anchorNodeIndex)
		selectionState.focusPath.setLastPathIndex(anchorNodeIndex)

		selectionState.anchorOffset = newAnchorOffset;
		selectionState.focusOffset = newAnchorOffset;

		selectionState.anchorType = lastConnectingNode.getType();
		selectionState.focusType = lastConnectingNode.getType();

		selectionState.sameBlock = true;
		selectionState.isCollapsed = true;
	}

	removeNodeByKey(key: string){
		let index = this.BlockNodes.findIndex(block => block.$getNodeKey() === key)
		if(index !== -1) this.BlockNodes.splice(index, 1)
	}

	removeBlock(blockIndex: number): void {
		this.BlockNodes.splice(blockIndex, 1)
	}

	sliceBlockFromContent(start: number, end?: number): void {
		this.BlockNodes = [...this.BlockNodes.slice(0, start), ...this.BlockNodes.slice(end ?? start)];
	}

	insertBlockNodeBetween(block: BlockType, start: number, end?: number): void {
		if (end !== undefined) {
			this.BlockNodes = [...this.BlockNodes.slice(0, start), block, ...this.BlockNodes.slice(end ?? start)];
		} else {
			this.BlockNodes = [...this.BlockNodes.slice(0, start), block];
		}
	}

	getTextNodeOffset(node: TextNode, offset: number): number {
		let TextContentLength = node.getContentLength();
		if (offset === -1) {
			offset = TextContentLength;
		} else if (offset > TextContentLength) {
			offset = TextContentLength;
		}
		return offset;
	}
	/**
	 * Adding letters to nodes and then updating them
	 * @param  {KeyboardEvent} KeyBoardEvent
	 * @param  {SelectionState} selectionState
	 * @returns void
	 */
	insertLetterIntoTextNode(KeyBoardEvent?: KeyboardEvent): void {

		const remove = KeyBoardEvent === undefined ? true : false
		let Key = remove ? '' : KeyBoardEvent ? KeyBoardEvent.key : '';
		
		const selectionState = getSelectionState()
		const anchorPath = selectionState.anchorPath
		const focusPath = selectionState.focusPath

		let anchorBlockNode = this.getBlockByPath(anchorPath.getBlockPath()) as BlockNode;
		let focusBlockNode

		let anchorNodeData = anchorBlockNode.getChildrenByIndex ? anchorBlockNode.getChildrenByIndex(anchorPath.getLastIndex()) : undefined;
		let focusNodeData: NodeTypes | undefined

		const handleOffsetStart = () => {
			if (selectionState.isOffsetOnStart()) {
				let isDecoratorAnchor = isDecoratorNode(anchorBlockNode)
				if (focusPath.getBlockIndex() !== 0 || (isDecoratorAnchor && focusPath.getContentNodeIndex() !== 0.)) {

					if(isDecoratorAnchor){
						anchorPath.set(selectionState.anchorPath.getBlockPath())
						anchorBlockNode = this.getBlockByPath(anchorPath.getBlockPath())
					}

					let previousBlockPath = new NodePath([...selectionState.anchorPath.get()]);
					previousBlockPath.addOrRemoveToBlock('dec', 1);

					let previousBlock = this.getBlockByPath(previousBlockPath.getBlockPath());
	
					if(!(previousBlock instanceof BlockNode)){
						previousBlock.remove()
						selectionState.anchorPath.addOrRemoveToBlock('dec', 1);
						selectionState.setAnchorKey(anchorBlockNode.getFirstChild().$getNodeKey()).offsetToZero()
					}
					else if(
						(anchorBlockNode.isBreakLine() && previousBlock.isBreakLine()) || 
						(anchorBlockNode.isBreakLine() === false && previousBlock.isBreakLine())
						)
					{
						previousBlock.remove()
						selectionState.anchorPath.addOrRemoveToBlock('dec', 1);
						selectionState.setAnchorKey(anchorBlockNode.getFirstChild().$getNodeKey()).toggleCollapse()
					}
					else if(anchorBlockNode.isBreakLine() && previousBlock.isBreakLine() === false){
						selectionState.moveSelectionToPreviousBlock(this)
						anchorBlockNode.remove()
					}
					else {
						let currentContentNode: ContentNode | undefined = undefined;
						if (selectionState.anchorPath.length() === 1) currentContentNode = this;
						else currentContentNode = this.getBlockByPath(anchorPath.getContentNode());
		
						currentContentNode = (currentContentNode as any).ContentNode ?? currentContentNode;
						
						if(currentContentNode){
							selectionState.anchorPath.addOrRemoveToBlock('dec', 1);
							this.MergeBlocks(currentContentNode.BlockNodes, 'up', 'backward');
						}
					}
				}
		}
	}


		// DOING SOME WORK TO OPTIMIZE FUNCTION AND REPLACING BREAK LINES IF SELECTED
		if(anchorNodeData?.getType() === BREAK_LINE_TYPE && !remove){
			anchorNodeData = createTextNode()
			anchorBlockNode.replaceNode(0, anchorNodeData)
			selectionState.setAnchorKey(anchorBlockNode.getFirstChild().$getNodeKey())
			anchorBlockNode.remount()
		}
		if(selectionState.isCollapsed === false){
			if(selectionState.isNodesPathEqual() === false){
				focusBlockNode = this.getBlockByPath(focusPath.getBlockPath()) as BlockNode;
				focusNodeData = focusBlockNode.getChildrenByIndex ? focusBlockNode.getChildrenByIndex(focusPath.getLastIndex()) : undefined;
			}
			else{
				focusBlockNode = anchorBlockNode
				focusNodeData = anchorBlockNode.getChildrenByIndex(focusPath.getLastIndex());
			}
			if(focusNodeData && focusNodeData.getType() === BREAK_LINE_TYPE && !remove){
				focusNodeData = createTextNode()
				selectionState.focusKey = focusNodeData.$getNodeKey()
				focusBlockNode.replaceNode(anchorPath.getLastIndex(), focusNodeData)
			}
			} 
		else {
			focusBlockNode = anchorBlockNode
			focusNodeData = anchorNodeData
		}
		if(anchorNodeData === undefined ) return;


		if (selectionState.isCollapsed) {
			if (anchorNodeData instanceof TextNode) {
				
				let SliceFrom = remove ? selectionState.anchorOffset - 1 : selectionState.anchorOffset;
				let SliceTo = selectionState.focusOffset;

				if (Key === ' ' && KeyBoardEvent?.which === 229) {
					Key = '.';
					SliceFrom -= 1;
				} else if(!remove) selectionState.moveSelectionForward();

				anchorNodeData.update(() => {
					this.TextNodeSlice(anchorNodeData as TextNode, Key, SliceFrom, SliceTo);
				})

				if(remove){
					if(selectionState.isOffsetOnStart()){
						handleOffsetStart()
					}
					else {
						if(anchorBlockNode?.isBreakLine && anchorBlockNode?.isBreakLine()){
							selectionState.offsetToZero().toggleCollapse().setNodeKey(anchorBlockNode.getFirstChild()?.$getNodeKey())
						}
						else if(anchorNodeData.getContent() === ''){
							selectionState.moveSelectionToPreviousSibling(this)
						}
						else selectionState.moveSelectionBackward();
					}
				}


				
			} else if(selectionState.isOffsetOnStart() && remove){
				handleOffsetStart()
			}
		} else if (selectionState.sameBlock) {
			if (selectionState.isNodesSame() === false) {
				

				let NodeSplitStart = anchorPath.getLastIndex() + 1;
				let NodeSplitEnd = focusPath.getLastIndex();


				if (anchorNodeData instanceof TextNode) {
					anchorNodeData.update(() => {
						this.TextNodeSlice(anchorNodeData as TextNode, Key, selectionState.anchorOffset);
					})
					if(anchorNodeData.$getNodeStatus() === 0) NodeSplitStart += 1
				} 
				else {

					let previousSibling = anchorBlockNode.previousSibling(anchorPath.getLastIndex());
					if (previousSibling !== undefined && previousSibling instanceof TextNode) {

						previousSibling.update(() => {
							this.TextNodeSlice(previousSibling as TextNode, Key, -1);
						})
						if(previousSibling.$getNodeStatus() === 0) NodeSplitStart += 1

					} 
					else NodeSplitStart -= 1;
				}


				if (focusNodeData instanceof TextNode) {
					focusNodeData.update(() => {
						this.TextNodeSlice(focusNodeData as TextNode, '', selectionState.focusOffset, -1);
					})
				} else NodeSplitEnd += 1;
				

				if(NodeSplitEnd - NodeSplitStart > 0 && anchorPath.length() === focusPath.length()){
					anchorBlockNode.removeDomNodes(true, NodeSplitStart, NodeSplitEnd)
				}
				else{
					const anchorIsDecorator = isDecoratorNode(anchorBlockNode) 
					if(NodeSplitStart > 0){
						if(anchorIsDecorator === false){
							NodeSplitStart += isDecoratorNode(focusBlockNode) ? 1 : 0
							anchorBlockNode.removeDomNodes(true, NodeSplitStart, NodeSplitStart)
						}
						else anchorBlockNode.removeDomNodes(true, NodeSplitStart)
						
					}
					if(NodeSplitEnd > 0) focusBlockNode.removeDomNodes(anchorIsDecorator ? true : false, NodeSplitEnd)

				}

				if(anchorBlockNode.isBreakLine()){
					selectionState.setAnchorKey(anchorBlockNode.getFirstChild().$getNodeKey()).toggleCollapse()
				}
				else selectionState.moveSelectionForward().toggleCollapse();

			} 
			else {
				if (anchorNodeData instanceof TextNode) {

					anchorNodeData.update(() => {
						this.TextNodeSlice(anchorNodeData as TextNode, Key, selectionState.anchorOffset, selectionState.focusOffset);
					})
					if(remove){
						if(anchorBlockNode.isBreakLine()){
							selectionState.offsetToZero().setNodeKey(anchorBlockNode.getFirstChild()?.$getNodeKey())
						}
						else selectionState.toggleCollapse()
					}
					else selectionState.toggleCollapse().moveSelectionForward();

				} else anchorNodeData.remove()
			}
		} else if (selectionState.sameBlock === false) {

			let NodeSplitStart = anchorPath.getLastIndex() + 1;
			let NodeSplitEnd = focusPath.getLastIndex();


			if (isDefined(anchorNodeData)) {
				if (anchorNodeData instanceof TextNode) {
					this.TextNodeSlice(anchorNodeData, Key, selectionState.anchorOffset);
				} 
				else {
					let previousSibling = anchorBlockNode.previousSibling(anchorPath.getBlockIndex());
					if (previousSibling instanceof TextNode) {
						this.TextNodeSlice(previousSibling, Key, -1);
					} 
					else anchorBlockNode.splitChild(false, NodeSplitStart, NodeSplitStart + 1, createTextNode());
					NodeSplitStart -= 1;
				}

				if(NodeSplitStart > 0 && !isDecoratorNode(anchorBlockNode)) {
					anchorBlockNode.splitChild(true, NodeSplitStart);
				}
				else{
					if(isDecoratorNode(anchorBlockNode)){
						if(NodeSplitStart > 0) anchorBlockNode.splitChild(true, NodeSplitStart);
						if(anchorPath.getBlockIndex() > 0) {
							this.getBlockByPath(anchorPath.getContentNode()).splitChild(true, anchorPath.getBlockIndex());
						}
						
					}
				}
			}

			if (isDefined(focusNodeData)) {
				if (focusNodeData instanceof TextNode) {
					this.TextNodeSlice(focusNodeData, anchorNodeData === undefined ? Key : '', selectionState.focusOffset, -1);
				} else NodeSplitEnd += 1;

				if(NodeSplitEnd > 0 && !isDecoratorNode(focusBlockNode)) {
					focusBlockNode.splitChild(false, NodeSplitEnd);
				}
				else{
					if(isDecoratorNode(focusBlockNode)){
						if(NodeSplitEnd > 0) focusBlockNode.splitChild(false, NodeSplitEnd);
						if(focusPath.getBlockIndex() > 0 && NodeSplitEnd <= focusPath.getBlockIndex()){
							this.getBlockByPath(focusPath.getContentNode()).splitChild(false, focusPath.getBlockIndex());
						}
					}
				}
			}
			if(isDefined(anchorNodeData) && isDefined(focusNodeData)) {

				let ParentNode 
				let anchorBlockSlice
				let focusBlockSlice = isDecoratorNode(focusBlockNode) ? focusPath.getContentNodeIndex() : focusPath.getBlockIndex()

				if(isDecoratorNode(anchorBlockNode)){
					ParentNode = this
					anchorBlockSlice = anchorPath.getContentNodeIndex() + 1
				}
				else {
					ParentNode = this.getBlockByPath(anchorPath.getContentNode());
					anchorBlockSlice = anchorPath.getBlockIndex() + 1
				}

				let ParentContentNode: ContentNode = ParentNode.ContentNode ? ParentNode.ContentNode : ParentNode
				if(focusBlockSlice - anchorBlockSlice > 0){
					ParentContentNode.removeDomNodes(true, anchorBlockSlice, focusBlockSlice)
				}

				this.MergeBlocks(ParentContentNode, 'up', 'forward');
				selectionState.moveSelectionForward();
			}
			else if (anchorNodeData !== undefined) selectionState.moveSelectionForward();
			else if (focusNodeData !== undefined) selectionState.offsetToZero().toggleCollapse(true);
		}
	}
	/**
	 * Removing letters from nodes and updates them
	 * @param  {SelectionState} selectionState
	 * @returns void
	 */
	removeLetterFromBlock(): void {
		this.insertLetterIntoTextNode(undefined)
	}
	
	/**
	 * Handling enter event, slicing nodes to BlockNodes and then mount them
	 * @param  {SelectionState} selectionState
	 * @returns void
	 */
	handleEnter(): void {
		let selectionState = getSelectionState()
		let anchorPath = selectionState.anchorPath;

		if (selectionState.isOffsetOnStart()) {
			let newBlockNode = new BlockNode({_children: [new BreakLine()]})
			this.getCurrentContentNode(anchorPath).insertBlockNodeBetween(
				newBlockNode,
				anchorPath.getBlockIndex(),
				anchorPath.getBlockIndex(),
			);
			this.insertNode(newBlockNode, anchorPath.getBlockIndex(), 'before')
			selectionState.toggleCollapse()

		} else if (selectionState.isCollapsed) {

			let CurrentBlock = this.getBlockByPath(anchorPath.getBlockPath());
			let anchorNode = CurrentBlock.getChildrenByIndex(anchorPath.getLastIndex());

			let anchorNodeSlice = anchorPath.getLastIndex();
			let SlicedNodes = undefined;
			let currentContentNode: ContentNode = this.getCurrentContentNode(anchorPath);

			if (selectionState.anchorOffset !== 0) {
				if (anchorNode instanceof TextNode) {
					let SliceContent = anchorNode.getSlicedContent(false, selectionState.anchorOffset);
					this.TextNodeSlice(anchorNode, '', selectionState.anchorOffset);
					anchorNodeSlice += 1;
					if(SliceContent !== ''){
						SlicedNodes = anchorNode.createSelfNode({plainText: SliceContent, styles: anchorNode.getNodeStyle()});
					}
				} else {
					anchorNodeSlice += 1;
					SlicedNodes = undefined;
				}
			}
			let SliceCharNodes = CurrentBlock._children.slice(anchorNodeSlice);
			if(SliceCharNodes.length > 0) CurrentBlock.splitNodes(true, anchorNodeSlice);

			CurrentBlock.remount()
		
			if(SlicedNodes !== undefined) SliceCharNodes = [SlicedNodes ?? [], ...SliceCharNodes];
			else if(SlicedNodes === undefined && SliceCharNodes.length === 0) SliceCharNodes = [new BreakLine()]

			let newBlockNode = new BlockNode({
				_children: SliceCharNodes,
				blockWrapper: CurrentBlock.blockWrapper,
			});

			currentContentNode.insertNode(newBlockNode, anchorPath.getBlockIndex(), 'before')
			selectionState.setAnchorKey(newBlockNode.$getNodeKey()).offsetToZero().toggleCollapse()

		} else {

			if (selectionState.isBlockPathEqual()) {

		
				let currentContentNode: ContentNode = this.getCurrentContentNode(anchorPath);


				let focusPath = selectionState.focusPath
				let AnchorBlock = this.getBlockByPath(anchorPath.getBlockPath()) as BlockNode;

				let anchorNodeData = AnchorBlock.getChildrenByIndex(anchorPath.getLastIndex());
				let focusNodeData = AnchorBlock.getChildrenByIndex(focusPath.getLastIndex());

				let anchorNodeSlice = anchorPath.getLastIndex() + 1;
				let focusNodeSlice = focusPath.getLastIndex() + 1;
				let SlicedTextNode: undefined | TextNode = undefined;

				if (anchorNodeSlice !== focusNodeSlice) {
					if (anchorNodeData instanceof TextNode) {
						this.TextNodeSlice(anchorNodeData, '', selectionState.anchorOffset);
					} else focusNodeSlice += 1;

					if (focusNodeData instanceof TextNode) {
						SlicedTextNode = focusNodeData.createSelfNode({
							plainText: focusNodeData.getSlicedContent(false, selectionState.focusOffset),
							styles: focusNodeData.getNodeStyle(),
						});
						this.TextNodeSlice(focusNodeData, '', selectionState.focusOffset, -1);
					} else focusNodeSlice += 1;
				} else {
					if (focusNodeData instanceof TextNode) {
						SlicedTextNode = focusNodeData.createSelfNode({
							plainText: focusNodeData.getSlicedContent(false, selectionState.focusOffset),
							styles: focusNodeData.getNodeStyle(),
						});
						this.TextNodeSlice(focusNodeData, '', selectionState.anchorOffset);
					} else focusNodeSlice += 1;
				}

				let SliceCharNodes = AnchorBlock._children.slice(focusNodeSlice);
				if (SlicedTextNode !== undefined && SlicedTextNode.getContentLength() > 0) {
					SliceCharNodes = [SlicedTextNode, ...SliceCharNodes];
				}

				if(SliceCharNodes.length > 0){
					AnchorBlock.splitChild(true, anchorNodeSlice);
					AnchorBlock.remount()
				}
				else if(anchorNodeData instanceof TextNode){
					anchorNodeData.update(() => {
						this.TextNodeSlice((anchorNodeData as TextNode), '', selectionState.anchorOffset);
					})
					SliceCharNodes = [new BreakLine()];
				}

				let newBlockNode = new BlockNode({
					_children: SliceCharNodes,
					blockType: AnchorBlock.blockType,
				});

				currentContentNode.insertNode(newBlockNode, anchorPath.getBlockIndex(), 'before')
				selectionState.setAnchorKey(newBlockNode.$getNodeKey()).offsetToZero().toggleCollapse()

			} else if (selectionState.isBlockPathEqual() === false) {
				this.removeLetterFromBlock();
			}
		}
	}
}


export {
	createContentNode,
	ContentNode
}