/**
 * 最后做,去掉jquery,目前有些代码使用原生写的,有点乱
 */

'use strict';

import '../css/base.css';
import {traversalStartLen, transfer, reverse} from './util';
import $ from 'jquery';
import Modal from './modal'

/**
 * 批注组件,兼容IE9
 */
class FMark {

    constructor() {
        this.ifDrag = false;
        this.mouseDownStartTime = Date.now();
        //序列,储存划线信息数组
        this.fmarkList = {};
        //标识,是否是mouseup事件后的点击事件
        this.isMouseUp = false;
        this.currentNoteId = '';
        
    }

    render() {}
    bindEvent() {

        let _this = this;

        //TODO 读数据
        //request 根据返回数据中的type字段
        //this.fmarkList 添加返回的数据

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
            Modal.hideMarkPopup();

            //选取时间大于300ms && 鼠标停止时所在元素不是html
            if(window.getSelection && _this.ifDrag && (Date.now() - _this.mouseDownStartTime > 300) && e.target !== $('html')[0]) {

                let selObj = window.getSelection(),
                    selRange = selObj.getRangeAt(0);
                //选中区域有文字
                if(selObj.toString()) {

                    let common_node = selRange.commonAncestorContainer;
                    if(selRange.commonAncestorContainer.nodeType !== 1) {
                        common_node = selRange.commonAncestorContainer.parentNode;
                    }

                    let rangeRect = selRange.getClientRects(),
                        rangePosMiddle = (rangeRect[rangeRect.length - 1].left + rangeRect[rangeRect.length - 1].right) / 2;

                    //需要储存的信息
                    let currentRangeInfo = {
                        start_index: traversalStartLen(selRange),
                        text_length:  $.trim(selRange.toString()).length,
                        common_tag: common_node.nodeName,
                        tag_index: $(common_node).index(common_node.nodeName),
                        title: document.title,
                        url: location.href,
                        content: selRange.toString(),
                        right: rangeRect[rangeRect.length - 1].right,
                        bottom: rangeRect[rangeRect.length - 1].bottom,
                        left: rangeRect[rangeRect.length - 1].left,
                        top: rangeRect[rangeRect.length - 1].top
                    }

                    //划线功能
                    let markLine = (selRange, id) => {
                        //起止文本在一个元素内
                        if(selRange.startContainer == selRange.endContainer) {
                            selRange.surroundContents($('<rxl class="rxl" data-id="' + id + '"></rxl>')[0]);
                        }else {
                            //TODO 可以只用这个
                            //选中的文本是跨元素的,所以父级元素肯定有孩子元素
                            transfer($.extend(currentRangeInfo, {id: id, type: 'underline'}));
                        }
                    };


                    //TODO 划线 request,暂时使用假的id,每次发请求回来应该有一个id
                    let randomId = (Math.random() * 100).toFixed(2);
                    currentRangeInfo.id = randomId;
                    // markLine(selRange, randomId);

                    // 吊起功能框
                    Modal.onMarkit(function(id, msg) {
                        let randomId = Math.random() * 100;
                        markLine(selRange, randomId);
                    });
                    Modal.showMarkPopup(rangePosMiddle, rangeRect[rangeRect.length - 1].bottom, currentRangeInfo);


                    //添加评论小tip
                    let addNoteTip = (currentRangeInfo) => {
                        //计算选中文本最后一个字符宽度
                        //TODO 这样的话要创建一个多余的dom用来计算,比较恶心
                        var lastWordNode = document.getElementsByClassName('icon')[0];
                        lastWordNode.innerHTML = currentRangeInfo.content.toString().slice(-1);

                        let tipTop = currentRangeInfo.top - 9,
                            tipLeft = currentRangeInfo.right - lastWordNode.offsetWidth / 2 - 3.5;
                        let noteDotNode = document.createElement('div');
                        //添加标识
                        noteDotNode.setAttribute('data-id', currentRangeInfo.id);
                        noteDotNode.innerHTML = '<div class="note-dot" style=" top:' + tipTop + 'px; left:' + tipLeft + 'px "></div>';
                        document.getElementById('markings-layer').appendChild(noteDotNode);
                    }

                    addNoteTip(currentRangeInfo);

                    _this.fmarkList[randomId] = $.extend(currentRangeInfo, {id: randomId});
                }
            }
            $(document).off('mousemove');
            _this.ifDrag = false;
        })

        //点击划线事件
        document.addEventListener('click',function(e) {

            //点击划线区域可选删除
            if(e.target && e.target.nodeName.toUpperCase() == 'RXL') {
                //删除逻辑
                //TODO delete request
                let currentRangeId = e.target.dataset.id;
                reverse(_this.fmarkList[currentRangeId]);

            //点击评论tip显示划线
            }else if(e.target && e.target.getAttribute('class') == 'note-dot') {
                if(_this.currentNoteId) {
                    reverse(_this.fmarkList[_this.currentNoteId])
                }
                //取当前range的id
                let noteId = e.target.parentNode.dataset.id;
                _this.currentNoteId = noteId;
                //TODO 显示划线,弹出评论框
                transfer(_this.fmarkList[noteId]);

            }else if(_this.currentNoteId) {
                reverse(_this.fmarkList[_this.currentNoteId])
            }
        }, false)
    }
}


let mark = new FMark();
mark.bindEvent();