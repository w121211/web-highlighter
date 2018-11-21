import {CAMEL_DATASET_IDENTIFIER} from './const';
import {
    SplitType,
    SelectedNode,
    DomMeta,
    DomNode,
    SelectedNodeType
} from '../types';

const countGlobalNodeIndex = ($node: Node): number => {
    const tagName = ($node as HTMLElement).tagName;
    const $list = document.getElementsByTagName(tagName);
    for (let i = 0; i < $list.length; i++) {
        if ($node === $list[i]) {
            return i;
        }
    }
    return -1;
};

const getTextChildByOffset = ($root: Node, offset: number): DomNode => {
    const nodeStack: Array<Node> = [$root];

    let $curNode: Node = null;
    let curOffset = 0;
    let startOffset = 0;
    while ($curNode = nodeStack.pop()) {
        const children = $curNode.childNodes;
        for (let i = children.length - 1; i >= 0; i--) {
            nodeStack.push(children[i]);
        }

        if ($curNode.nodeType === 3) {
            startOffset = offset - curOffset;
            curOffset += $curNode.textContent.length;
            if (curOffset >= offset) {
                break;
            }
        }
    }

    return {
        $node: $curNode,
        offset: startOffset
    };
}

// 根（祖先）内，当前文本节点的前驱文本节点内容的总长度（offset）
// 不包含当前节点中的offset
const getTextPreOffset = ($root: Node, $text: Node): number => {
    const nodeStack: Array<Node> = [$root];

    let $curNode: Node = null;
    let offset = 0;
    while ($curNode = nodeStack.pop()) {
        const children = $curNode.childNodes;
        for (let i = children.length - 1; i >= 0; i--) {
            nodeStack.push(children[i]);
        }

        if ($curNode.nodeType === 3 && $curNode !== $text) {
            offset += $curNode.textContent.length;
        }
        else if ($curNode.nodeType === 3) {
            break;
        }
    }

    return offset;
}

// 找到非 highlight 的最近祖先节点，即为原始文档下的父节点
const getOriginParent = ($node: Text): HTMLElement => {
    let $originParent = $node.parentNode as HTMLElement;
    while (
        $originParent.dataset
        && $originParent.dataset[CAMEL_DATASET_IDENTIFIER]
    ) {
        $originParent = $originParent.parentNode as HTMLElement;
    }
    return $originParent;
};

export const getDomMeta = ($node: Text, offset: number): DomMeta => {
    const $originParent = getOriginParent($node);
    const index = countGlobalNodeIndex($originParent);
    const preNodeOffset = getTextPreOffset($originParent, $node);
    const tagName = $originParent.tagName;
    return {
        parentTagName: tagName,
        parentIndex: index,
        textOffset: preNodeOffset + offset
    };
};

export const queryDomByMeta = (meta: DomMeta) => {
    const {
        parentTagName: tagName,
        parentIndex: index,
        textOffset
    } = meta;
    const $parent = document.getElementsByTagName(tagName)[index];
    return getTextChildByOffset($parent, textOffset);
};

/**
 * [DFS] 获取开始与结束节点间选中的所有节点
 */
export const getSelectedNodes = (
    $root: HTMLElement | Document = window.document,
    $startNode: Node,
    $endNode: Node,
    startOffset: number,
    endOffset: number
): SelectedNode[] => {
    // 开始节点和结束节点为同一个节点时，直接截取该节点返回
    if ($startNode === $endNode && $startNode instanceof Text) {
        $startNode.splitText(startOffset);
        let passedNode = $startNode.nextSibling as Text;
        passedNode.splitText(endOffset - startOffset);
        return [{
            $node: passedNode,
            type: SelectedNodeType.text,
            splitType: SplitType.both
        }];
    }

    const nodeStack: Array<HTMLElement | Document | ChildNode | Text> = [$root];
    const selectedNodes: SelectedNode[] = [];

    let withinSelectedRange = false;
    let curNode: Node = null;
    while (curNode = nodeStack.pop()) {
        const children = curNode.childNodes;
        for (let i = children.length - 1; i >= 0; i--) {
            nodeStack.push(children[i]);
        }

        // 只记录文本节点
        if (curNode === $startNode) {
            if (curNode.nodeType === 3) {
                // 选取后半段
                (curNode as Text).splitText(startOffset);
                const node = curNode.nextSibling as Text;
                selectedNodes.push({
                    $node: node,
                    type: SelectedNodeType.text,
                    splitType: SplitType.head
                });

            }
            // 开始进入选择范围
            withinSelectedRange = true;
        }
        else if (curNode === $endNode) {
            if (curNode.nodeType === 3) {
                const node = (curNode as Text);
                // 截取前半段
                node.splitText(endOffset);
                selectedNodes.push({
                    $node: node,
                    type: SelectedNodeType.text,
                    splitType: SplitType.tail
                });
            }
            // 碰到结束节点，退出循环
            break;
        }
        // 范围内的普通文本节点
        else if (withinSelectedRange && curNode.nodeType === 3) {
            selectedNodes.push({
                $node: curNode as Text,
                type: SelectedNodeType.text,
                splitType: SplitType.none
            });
        }
    }
    return selectedNodes;
};

export const isHighlightWrapNode = ($node: HTMLElement) => (
    $node.dataset && $node.dataset[CAMEL_DATASET_IDENTIFIER]
);