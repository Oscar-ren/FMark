/**
 *
 */

'use strict';

import '../css/base.css';
import {traversalStartLen, transfer, reverse, makeAjaxData} from './util';
import {EventUtil} from './base';
import Modal from './modal';
import jsonp from 'jsonp';
/**
 * 批注组件,兼容IE9
 */
class FMark {
    constructor() {
        this.ifDrag = false;
        this.mouseDownStartTime = Date.now();
        //序列,储存划线信息数组
        this.fmarkList = {};
        //当前显示的评论id
        this.currentNoteId = '';
        this.host = 'http://www.fmark.com:8360';
    }

    render() {}
    bindEvent() {

        let _this = this;

        //评论tip容器
        let markLayer = document.createElement('div');
        markLayer.setAttribute('id', 'markings-layer');
        document.body.appendChild(markLayer);

        //TODO 读数据
        let param = {
            title: document.title,
            url: location.href
        };
        jsonp( _this.host + '/mark/getcomment?' + makeAjaxData(param), function(err, result) {
            for(let key in result) {
                result[key].position = JSON.parse(result[key].position);
                _this.fmarkList[result[key].id] = result[key];
                if(result[key].type == 2) {
                    _this.addNoteTip(result[key], result[key].id);
                }else {
                    //TODO 其他人的划线样式不一样
                    _this.markLine(result[key], result[key].id);
                }
            }
        });

        /**
         * 保证只有拖拽下选择的文本才会输出
         */
        EventUtil.addHandler(document, 'mousedown', function() {
            _this.mouseDownStartTime = Date.now();

            EventUtil.addHandler(document, 'mousemove', function() {
                _this.ifDrag = true;
            })
        })

        EventUtil.addHandler(document, 'mouseup', function(e) {
            e = EventUtil.getEvent(e);
            let target = EventUtil.getTarget(e);
            Modal.hideMarkPopup();

            //选取时间大于300ms && 鼠标停止时所在元素不是html
            if(window.getSelection && _this.ifDrag && (Date.now() - _this.mouseDownStartTime > 300) && target !== document.getElementsByTagName('html')[0]) {

                let selObj = window.getSelection(),
                    selRange = selObj.getRangeAt(0);
                //选中区域有文字
                if(selObj.toString()) {

                    let common_node = selRange.commonAncestorContainer;
                    if(selRange.commonAncestorContainer.nodeType !== 1) {
                        common_node = selRange.commonAncestorContainer.parentNode;
                    }
                    let tag_index = Array.from(document.getElementsByTagName(common_node.nodeName)).findIndex(function(value, index, arr) {
                        return value == common_node;
                    }),
                        //选取区域的位置
                        rangeRect = selRange.getClientRects(),
                        rangePosMiddle = (rangeRect[rangeRect.length - 1].left + rangeRect[rangeRect.length - 1].right) / 2;

                    //需要储存的信息
                    let currentRangeInfo = {
                        title: document.title,
                        url: location.href,
                        article_content: selRange.toString(),
                        position: {
                            start_index: traversalStartLen(selRange),
                            text_length: selRange.toString().trim().length,
                            common_tag: common_node.nodeName,
                            tag_index: tag_index,
                            right: rangeRect[rangeRect.length - 1].right,
                            bottom: rangeRect[rangeRect.length - 1].bottom,
                            left: rangeRect[rangeRect.length - 1].left,
                            top: rangeRect[rangeRect.length - 1].top
                        }
                    }

                    //新数据
                    Modal.showMarkPopup(rangePosMiddle, rangeRect[rangeRect.length - 1].bottom).then(function(data) {
                        //划线和评论请求格式一样
                        let param = '';
                        if(data.code == 'underline') {
                            param = Object.assign(currentRangeInfo, {type: 1});
                        }else if(data.code == 'mark') {
                            param = Object.assign(currentRangeInfo, {type: 2, discuss_content: data.msg});
                        }
                        jsonp( _this.host + '/mark/add?' + makeAjaxData(param), function(err, id) {
                            _this.fmarkList[id] = Object.assign(param, {id: id});
                            if(param.type == 1) {
                                _this.markLine(_this.fmarkList[id]);

                            }else {
                                _this.addNoteTip(_this.fmarkList[id]);
                            }
                        });
                    }, function(err) {
                        console.log(err, 'reject');
                    });
                }
            }
            EventUtil.removeHandler(document, 'mousemove');
            _this.ifDrag = false;
        })

        //点击划线事件
        EventUtil.addHandler(document, 'click',function(e) {
            e = EventUtil.getEvent(e);
            let target = EventUtil.getTarget(e);

            //点划线弹窗
            if(target && target.nodeName.toUpperCase() == 'FM') {
                let rangeInfo = _this.fmarkList[target.dataset.id];

                //删除划线
                Modal.showMarkPopup((rangeInfo.position.right + rangeInfo.position.left)/2, rangeInfo.position.bottom, true).then(function(data) {
                    if(data.code == 'del-underline') {
                        jsonp( _this.host + '/mark/deletecomment?' + makeAjaxData({id: target.dataset.id}),
                            function(err, result) {
                                console.log(result);
                                let currentRangeId = target.dataset.id;
                                reverse(_this.fmarkList[currentRangeId]);
                                delete _this.fmarkList[currentRangeId];
                            }
                        );
                    }
                    if(data.code == 'mark') {
                        let param = Object.assign(rangeInfo, {type: 2, discuss_content: data.msg, name: data.name});
                        jsonp( _this.host + '/mark/add?' + makeAjaxData(param), function(err, id) {
                            _this.fmarkList[id] = Object.assign(param, {id: id});
                            _this.addNoteTip(_this.fmarkList[id]);
                        });
                    }
                }, function(err) {
                    console.log(err, 'reject');
                });

            //点击评论tip显示划线
            }else if(target && target.getAttribute('class') == 'note-dot') {
                if(_this.currentNoteId) {
                    reverse(_this.fmarkList[_this.currentNoteId])
                }
                document.body.classList.add('hide-all-lines');
                //取当前range的id
                let noteId = target.parentNode.dataset.id,
                    rangeInfo = _this.fmarkList[noteId];

                _this.currentNoteId = noteId;
                //TODO 显示划线,弹出评论框
                Modal.showMarkComment((rangeInfo.position.right + rangeInfo.position.left)/2, rangeInfo.position.bottom, noteId)
                _this.markLine(rangeInfo);

            //点其他地方隐藏当前存储的已显示的评论的划线
            }else if(_this.currentNoteId) {
                document.body.classList.remove('hide-all-lines');
                reverse(_this.fmarkList[_this.currentNoteId])
            }
        })
    }

    //添加评论小tip功能
    addNoteTip(currentRangeInfo) {
        //计算选中文本最后一个字符宽度
        let lastWordNode = document.getElementsByClassName('fmark-hide')[0];
        if(!lastWordNode) {
            lastWordNode = document.createElement('span');
            lastWordNode.setAttribute('class', 'fmark-hide');
            document.body.appendChild(lastWordNode);
        }
        lastWordNode.innerHTML = currentRangeInfo.article_content.toString().slice(-1);

        let tipTop = currentRangeInfo.position.top - 9,
            tipLeft = currentRangeInfo.position.right - lastWordNode.offsetWidth / 2 - 3.5,
            noteDotNode = document.createElement('div');
        //添加标识
        noteDotNode.setAttribute('data-id', currentRangeInfo.id);
        noteDotNode.innerHTML = '<div class="note-dot" style=" top:' + tipTop + 'px; left:' + tipLeft + 'px "></div>';
        document.getElementById('markings-layer').appendChild(noteDotNode);
    }
    //划线功能
    markLine(currentRangeInfo) {
        transfer(currentRangeInfo);
    }

}

window.FMark = FMark;