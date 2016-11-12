'use strict';

import '../css/base.css';
import {traversalStartLen, transfer, reverse} from './util';
import $ from 'jquery';

/**
 * 批注组件,兼容IE9
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
    onMakeIt(range, posX, posY) {
        //todo 点击mark it 的回调

        //点击后发送请求,成功后划线
        let _this = this;
        $('div').promise().then(function(result) {
            console.log('promise resolve', result);
            // _this.markLine(range);
        }, function(err) {
            console.log(err);
        })

        //TODO 存本地调试
        // _this.fmarkList.push(currentRangeInfo);
        // console.log(_this.fmarkList);
        // localStorage.setItem('fmark', JSON.stringify(_this.fmarkList));

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
    showMarkPopup(range, posX, posY) {
        if (!this.markPopup) {
            this.initMarkPopup();
        }
        let _this = this;
        _this.markPopup.onclick = function() {
            _this.onMakeIt(range, posX, posY);
        }
        //修正的像素是为了尖角在所想的位置
        this.markPopup.style.top = posY + 6 + 'px';
        this.markPopup.style.left = posX - 40  + 'px';
        this.markPopup.style.display = 'block';
        // setTimeout(function() {
        //     _this.hideMarkPopup();
        // }, 1000 * 4);
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
                // console.log(existList[i]);
                // transfer(existList[i]);
            }
        }

        /**
         * 保证只有拖拽下选择的文本才会输出
         */
        $(document).on('mousedown', function() {
            _this.mouseDownStartTime = Date.now();
            $(document).on('mousemove', function() {
                _this.ifDrag = true;
            })
        })

        $(document).on('mouseup', function(e) {
            _this.hideMarkPopup();


            //选取时间大于300ms && 鼠标停止时所在元素不是html
            if(window.getSelection && _this.ifDrag && (Date.now() - _this.mouseDownStartTime > 300) && e.target !== $('html')[0]) {

                let selObj = window.getSelection(),
                    selRange = selObj.getRangeAt(0);

                //选中区域有文字
                if(selObj.toString()) {
                    //吊起功能框
                    let rangeRect = selRange.getClientRects(),
                        rangePosMiddle = (rangeRect[rangeRect.length - 1].left + rangeRect[rangeRect.length - 1].right) / 2
                    _this.showMarkPopup(selRange, rangePosMiddle, rangeRect[rangeRect.length - 1].bottom);
                }
            }
            $(document).off('mousemove');
            _this.ifDrag = false;
        })
    }
    //划线
    markLine(selRange) {

        let common_node = selRange.commonAncestorContainer;
        if(selRange.commonAncestorContainer.nodeType !== 1) {
            common_node = selRange.commonAncestorContainer.parentNode;
        }

        //需要储存的信息
        let currentRangeInfo = {
            start_index: traversalStartLen(selRange),
            text_length:  $.trim(selRange.toString()).length,
            common_tag: common_node.nodeName,
            tag_index: $(common_node).index(common_node.nodeName)
        }

        //起止文本在一个元素内
        if(selRange.startContainer == selRange.endContainer) {
            selRange.surroundContents($('<rxl class="rxl"></rxl>')[0]);
        }else {
            //选中的文本是跨元素的,所以父级元素肯定有孩子元素
            transfer(currentRangeInfo);
        }
    }
}


let mark = new FMark();
mark.bindEvent();