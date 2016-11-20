'use strict';

import '../css/base.less';
import {traversalStartLen, transfer, reverse} from './util';
import {EventUtil, encodeUrlParam, setCookie, getCookie} from './base';
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

        //TODO 设置cookie,过期时间为1天
        if(!getCookie('fmark')) {
            setCookie('fmark', (new Date()).getTime(), 1);
        }

        let _this = this;

        //评论tip容器
        let markLayer = document.createElement('div');
        markLayer.setAttribute('id', 'markings-layer');
        document.body.appendChild(markLayer);

        //读数据
        let param = {
            title: document.title,
            url: location.href
        };
        jsonp( _this.host + '/mark/getcomment?' + encodeUrlParam(param), function(err, result) {
            let noteList = {};


            for(let key in result) {
                //判断当前用户是否有权限修改,有权限更新cookie过期时间,hasAuthor不会发给数据库
                if(result[key].cookie == getCookie('fmark')) {
                    setCookie('fmark', getCookie('fmark'), 1);
                    result[key].hasAuthor = true;
                }
                result[key].position = JSON.parse(result[key].position);
                _this.fmarkList[result[key].id] = result[key];
                if(result[key].type == 2) {
                    //先留着,根据right值过滤一下
                    if(!Object.keys(noteList).find((n) => n == result[key].position.right)) {
                        noteList[result[key].position.right] = [];
                    }
                    //存结尾位置一样的评论id
                    noteList[result[key].position.right].push(result[key].id);

                }else {
                    _this.markLine(result[key]);
                }
            }
            for(let key in noteList) {
                _this.addNoteTip(_this.fmarkList[noteList[key][0]], noteList[key]);
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
                    //公共父级不能是text
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
                        host: location.hostname,
                        url: location.href,
                        article_content: selRange.toString(),
                        discuss: [],
                        position: {
                            start_index: traversalStartLen(selRange),
                            text_length: selRange.toString().trim().length,
                            common_tag: common_node.nodeName,
                            tag_index: tag_index,
                            right: Math.round(rangeRect[rangeRect.length - 1].right + window.pageXOffset),
                            bottom: Math.round(rangeRect[rangeRect.length - 1].bottom + window.pageYOffset),
                            left: Math.round(rangeRect[rangeRect.length - 1].left + window.pageXOffset),
                            top: Math.round(rangeRect[rangeRect.length - 1].top + window.pageYOffset)
                        },
                        cookie: getCookie('fmark')
                    }

                    //新数据
                    Modal.showMarkPopup((currentRangeInfo.position.right + currentRangeInfo.position.left)/2, currentRangeInfo.position.bottom).then(function(data) {
                        _this.requestServer(currentRangeInfo, data);
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
            Modal.hideMarkModal(target);
            if(!Modal.hideMarkComment(target)) return;

            //点划线弹窗
            if(target && target.nodeName.toUpperCase() == 'FM') {
                let rangeInfo = _this.fmarkList[target.dataset.id];

                //看是否有权限操作
                if(!_this.fmarkList[target.dataset.id].hasAuthor) return;

                //删除划线
                Modal.showMarkPopup((rangeInfo.position.right + rangeInfo.position.left)/2, rangeInfo.position.bottom, true).then(function(data) {
                    _this.requestServer(rangeInfo, Object.assign(data, {id: target.dataset.id}));
                }, function(err) {
                    console.log(err, 'reject');
                });

            //点击评论tip显示划线
            }else if(target && target.getAttribute('class') && target.getAttribute('class').indexOf('note-dot') > -1) {
                if(_this.currentNoteId) {
                    reverse(_this.fmarkList[_this.currentNoteId])
                }
                document.body.classList.add('hide-all-lines');

                //取当前range的id
                let noteId = target.parentNode['data-id'],
                    rangeInfo = _this.fmarkList[noteId[0]];

                //TODO 切换评论的时候要改变这个值
                _this.currentNoteId = noteId[0];
                let rangeInfos = [];
                for(let i = 0; i < noteId.length; i++) {
                    rangeInfos.push(_this.fmarkList[noteId[i]]);
                }

                console.log(rangeInfos);

                //显示划线,弹出评论框
                Modal.showMarkComment((rangeInfo.position.right + rangeInfo.position.left)/2, rangeInfo.position.bottom, rangeInfos);
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

        //判断当前位置是否已有评论,有的话,混合
        let idSets = [];
        for(let key in this.fmarkList) {
            if(this.fmarkList[key].position.right == currentRangeInfo.position.right) {
                idSets.push(key);
            }
        }
        //计算选中文本最后一个字符宽度
        let lastWordNode = document.getElementsByClassName('fmark-hide')[0],
            className = '';
        if(!lastWordNode) {
            lastWordNode = document.createElement('span');
            lastWordNode.setAttribute('class', 'fmark-hide');
            document.body.appendChild(lastWordNode);
        }
        lastWordNode.innerHTML = currentRangeInfo.article_content.toString().slice(-1);

        let tipTop = currentRangeInfo.position.top - 10,
            tipLeft = currentRangeInfo.position.right - lastWordNode.offsetWidth / 2 - 3.5,
            noteDotNode = document.createElement('div');


        //添加标识
        className = currentRangeInfo.hasAuthor ? 'note-dot isSelf' : 'note-dot';
        noteDotNode['data-id'] = idSets;
        noteDotNode.innerHTML = '<div class="' + className + '" style=" top:' + tipTop + 'px; left:' + tipLeft + 'px "></div>';
        document.getElementById('markings-layer').appendChild(noteDotNode);
    }
    //划线功能
    markLine(currentRangeInfo) {
        transfer(currentRangeInfo);
    }

    //请求回调,发请求
    requestServer(currentRangeInfo, data) {
        let param = '',
            _this = this;

        if(data.code == 'underline') {
            param = Object.assign(currentRangeInfo, {type: 1});
            jsonp( _this.host + '/mark/add?' + encodeUrlParam(param), function(err, data) {
                _this.fmarkList[data.comment_id] = Object.assign(param, {id: data.comment_id, hasAuthor: true});
                _this.markLine(_this.fmarkList[data.comment_id]);
            });
        }else if(data.code == 'mark') {
            if (!currentRangeInfo.discuss) {
                currentRangeInfo.discuss = [];
            }

            if (data.share == 'weibo') {
                let shareContent = '';
                window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(location.href)}&type=icon&language=zh_cn&title=${currentRangeInfo.article_content.trim()} + -分享自${encodeURIComponent(location.href)}&style=simple`);
            }
            param = Object.assign(currentRangeInfo, {type: 2, discuss_content: data.msg, name: data.name});
            jsonp( _this.host + '/mark/add?' + encodeUrlParam(param), function(err, data) {
                _this.fmarkList[data.comment_id] = Object.assign(param, {id: data.comment_id});
                _this.fmarkList[data.comment_id].discuss = [Object.assign({}, data.discuss)];
                _this.addNoteTip(_this.fmarkList[data.comment_id]);
            });
        }else if(data.code == 'del-underline') {
            jsonp( _this.host + '/mark/deletecomment?' + encodeUrlParam({id: data.id}),
                function(err, result) {
                    let currentRangeId = data.id;
                    reverse(_this.fmarkList[currentRangeId]);
                    delete _this.fmarkList[currentRangeId];
                }
            );
        }
    }

}

window.FMark = FMark;