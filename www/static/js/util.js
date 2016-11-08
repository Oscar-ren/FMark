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


export {traversalStartLen};