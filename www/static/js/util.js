/**
 * 遍历获取开始长度
 * @param selRange
 * @returns {number}
 */
let traversalStartLen = (selRange) => {

    let node = selRange.commonAncestorContainer,
        startContainer = selRange.startContainer,
        startOffset = selRange.startOffset,
        startIndex = 0,
        finalFlag = false;

    let core = (node) => {
        if(finalFlag) return 2;
        if(node.nodeType == 3) {
            if(node == startContainer) {
                startIndex += startOffset;
                finalFlag = true;
                return 2;
            }else {
                startIndex += node.nodeValue.length;
                return 1;
            }
        }
        for(let i = 0; i < node.childNodes.length; i++) {
            let result = core(node.childNodes[i]);
            if(result == 2) {
                break;
            }
        }
    }
    core(node);
    return startIndex
}

/**
 * 将选取文本转换成特定样式
 * @param info range对象信息
 * @returns {number}
 */
let transfer = (info) => {

    let startIndex = info.start_index,
        //剩余长度
        restTextLen = info.text_length,
        //第一次是公共父节点
        ancestorNode = $(info.common_tag)[info.tag_index],
        //起止游标
        startSearched = false,
        endSearched = false,
        //已查找长度
        beginTextLen = 0,
        id = info.id;

    /**
     * 遍历节点渲染
     */
    let traversalRender = (currentNode) => {

        if (endSearched) return 2;

        if(!startSearched && currentNode.nodeType == 3) {
            let normalTextLen = currentNode.nodeValue.length;
            if(beginTextLen + normalTextLen >= startIndex) {
                startSearched = true;
                currentNode.splitText(startIndex - beginTextLen);
                //考虑起始位置在同一个节点里
                let nextSibling= currentNode.nextSibling;
                if(nextSibling.nodeValue.length >= restTextLen) {
                    nextSibling.splitText(restTextLen);
                }
                changeNodeStyle(nextSibling, id);
                //找到了开头,下一个循环
                return 1;
            }else {
                //没找到开始节点,接着找
                beginTextLen += normalTextLen;
            }
        }
        //已经找到开始节点,且当前节点是text节点,且不为空
        if (startSearched && currentNode.nodeType == 3) {
            let normalTextLen = currentNode.nodeValue.length;

            //判断长度
            if (normalTextLen >= restTextLen) {
                currentNode.splitText(restTextLen);
                changeNodeStyle(currentNode, id);
                endSearched = true;
                //全都找完了,退出
                return 2;
            } else {
                restTextLen -= normalTextLen;
                changeNodeStyle(currentNode, id);
            }
        }

        let nodes = currentNode.childNodes;

        //遍历孩子节点
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let result = traversalRender(node);
            if (result == 2) break;
        }
    }

    /**
     * 改变选取区域样式
     */
    let changeNodeStyle = (node, id) => {
        let par = node.parentNode;
        let spanEle = document.createElement('rxl');
        spanEle.setAttribute('class', 'rxl');
        spanEle.setAttribute('data-id', id);
        spanEle.appendChild(node.cloneNode(false));
        //使用替换节点的方法
        par.replaceChild(spanEle, node);
    }

    traversalRender(ancestorNode);

}

/**
 * 翻转标注,还原成正常dom
 * @param info
 */
let reverse = (info) => {

    let restTextLen = info.text_length,
        //第一次是公共父节点
        ancestorNode = $(info.common_tag)[info.tag_index],
        id = info.id;

    let core = (node) => {
        if(node.tagName == 'RXL' && node.getAttribute('data-id') == id) {
            if(node.childNodes) {
                for(let i = 0; i < node.childNodes.length; i++) {
                    let result = core(node.childNodes[i]);
                    if(result == 2) {
                        break;
                    }
                }
            }
            let fragment = document.createDocumentFragment();
            for(let i = 0; i < node.childNodes.length; i++) {
                fragment.appendChild(node.childNodes[i].cloneNode(true))
            }
            node.parentNode.replaceChild(fragment, node);
            restTextLen -= node.innerHTML.length;
            if(restTextLen == 0) {
                return 2;
            }else {
                return 1;
            }
        }
        for(let i = 0; i < node.childNodes.length; i++) {
            let result = core(node.childNodes[i]);
            if(result == 2) {
                break;
            }
        }
    }
    core(ancestorNode);
}


export {traversalStartLen, transfer, reverse};