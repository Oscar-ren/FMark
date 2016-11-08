'use strict';

import '../css/base.css';
import {traversalStartLen} from './util';
import $ from 'jquery';

/**
 * 批注组件
 */
class FMark {

    constructor() {
        this.ifDrag = false;
        this.mouseDownStartTime = Date.now();
        //序列,储存划线信息数组
        this.fmarkList = [];
        //标识,是否是mouseup事件后的点击事件
        this.isMouseUp = false;
        this.markPopup = undefined;
        this.host = 'http://localhost:8360';
    }

    render() {}
    onMakeIt(posX, posY) {
        //todo 点击mark it 的回调
        console.log('aaa');
        this.hideMarkPopup();
    }
    initMarkPopup() {
        let _this = this;
        let markPopup = document.createElement('ul');
        markPopup.className = 'mark-it';
        markPopup.innerHTML = '<li class="mark-triangle"><i class="triangle"></i></li><li class="mark-note"><button class="note">Mark it!</button></li>'
        
        document.body.appendChild(markPopup);
        this.markPopup = markPopup;
    }
    initMarkModal() {
        let _this = this;
        let markModal = document.createElement('div');
        markModal.className = 'mark-modal';
    }
    showMarkPopup(posX, posY) {
        if (!this.markPopup) {
            this.initMarkPopup();
        }
        let _this = this;
        _this.markPopup.onclick = function() {
            _this.onMakeIt(posX, posY);
        }
        //修正的像素是为了尖角在所想的位置
        this.markPopup.style.top = posY + 6 + 'px';
        this.markPopup.style.left = posX - 40  + 'px';
        this.markPopup.style.display = 'block';
        setTimeout(function() {
            _this.hideMarkPopup();
        }, 1000 * 4);
    }
    hideMarkPopup() {
        this.markPopup && (this.markPopup.style.display = 'none');
    }
    bindEvent() {

        let _this = this;

        //读数据
        if(localStorage.getItem('fmark')) {
            let existList = JSON.parse(localStorage.getItem('fmark'));
            for(let i = 0; i < existList.length; i++) {
                console.log(existList[i]);
                // this.transfer(existList[i]);
            }
        }

        /**
         * 保证只有拖拽下选择的文本才会输出
         */
        $(document).on('mousedown', function() {
            _this.mouseDownStartTime = Date.now();
            _this.hideMarkPopup();
            $(document).on('mousemove', function() {
                _this.ifDrag = true;
            })
        })

        $(document).on('mouseup', function(e) {

            //选取时间大于300ms && 鼠标停止时所在元素不是html
            if(window.getSelection && _this.ifDrag && (Date.now() - _this.mouseDownStartTime > 300) && e.target !== $('html')[0]) {

                let selObj = window.getSelection(),
                    selRange = selObj.getRangeAt(0);

                //选中区域有文字
                if(selObj.toString()) {

                    //需要储存的信息
                    let currentRangeInfo = {
                        start_index: traversalStartLen(selRange),
                        text_length:  $.trim(selRange.toString()).length,
                        common_tag: selRange.commonAncestorContainer.nodeName,
                        tag_index: $(selRange.commonAncestorContainer).index(selRange.commonAncestorContainer.nodeName)
                    }

                    //起止文本在一个元素内
                    if(selRange.startContainer == selRange.endContainer) {
                        //兼容性IE9
                        selRange.surroundContents($('<rxl class="rxl"></rxl>')[0]);
                    }else {
                        //选中的文本是跨元素的,所以父级元素肯定有孩子元素
                        _this.transfer(currentRangeInfo);
                    }

                    //TODO 存本地调试
                    // _this.fmarkList.push(currentRangeInfo);
                    // localStorage.setItem('fmark', JSON.stringify(_this.fmarkList));
                }
            }
            $(document).off('mousemove');
            _this.ifDrag = false;
        })
    }

    /**
     * 将选取文本转换成特定样式
     * @param info range对象信息
     * @returns {number}
     */
    transfer(info) {

        let startIndex = info.start_index,
            //剩余长度
            restTextLen = info.text_length,
            //第一次是公共父节点
            ancestorNode = $(info.common_tag)[info.tag_index],
            //起止游标
            startSearched = false,
            endSearched = false,
            //已查找长度
            beginTextLen = 0;

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
                    console.log('startSearched', currentNode.nextSibling);
                    //判断长度,初始节点不可能和结束节点在同一个dom上
                    changeNodeStyle(currentNode.nextSibling);
                    //找到了开头,下一个循环
                    return 1;
                }else {
                    //没找到开始节点,接着找
                    beginTextLen += normalTextLen;
                    console.log(currentNode, beginTextLen);
                }
            }
            //已经找到开始节点,且当前节点是text节点,且不为空
            if (startSearched && currentNode.nodeType == 3) {
                let normalTextLen = currentNode.nodeValue.length;

                //判断长度
                if (normalTextLen >= restTextLen) {
                    currentNode.splitText(restTextLen);
                    changeNodeStyle(currentNode);
                    endSearched = true;
                    //全都找完了,退出
                    return 2;
                } else {
                    restTextLen -= normalTextLen;
                    console.log(currentNode);
                    changeNodeStyle(currentNode);
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
        let changeNodeStyle = (node) => {
            let par = node.parentNode;
            let spanEle = document.createElement('rxl');
            spanEle.setAttribute('class', 'rxl');
            spanEle.appendChild(node.cloneNode(false));
            //使用替换节点的方法
            par.replaceChild(spanEle, node);
        }

        traversalRender(ancestorNode);

    }
}


let mark = new FMark();
mark.bindEvent();