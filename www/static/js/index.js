/**
 * FMark 提供网站划线标注服务
 *
 * 不依赖其他框架,如jQuery等
 * 采用es6语法,webpack打包
 * 如遇问题请提交到 https://github.com/Oscar-ren/FMark/issues
 */

'use strict';

import '../css/base.less';
import {traversalStartLen, transfer, reverse} from './util';
import {EventUtil, encodeUrlParam, setCookie, getCookie} from './base';
import Modal from './modal';
import jsonp from 'jsonp';
/**
 * 兼容IE9
 */
class FMark {
    constructor() {
        this.ifDrag = false;
        this.mouseDownStartTime = Date.now();
        //序列,储存划线信息数组
        this.fmarkList = {};
        //当前显示的评论id
        this.currentNoteId = '';
        this.host = 'http://laughter.pub';
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
                //noteList[key]里面存的是一样位置的id
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
                    selRange = {};

                if(selObj) {
                    selRange = selObj.getRangeAt(0);
                }

                //选中区域有文字
                if(selRange && selObj.toString()) {

                    let common_node = selRange.commonAncestorContainer;
                    //公共父级不能是text
                    if(selRange.commonAncestorContainer.nodeType !== 1) {
                        common_node = selRange.commonAncestorContainer.parentNode;
                    }
                    let tag_index = Array.from(document.getElementsByTagName(common_node.nodeName)).findIndex(function(value, index, arr) {
                        return value == common_node;
                    }),
                        //选取区域的位置
                        rangeRect = selRange.getClientRects();

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

                let tag_index = Array.from(document.getElementsByClassName('note-dot')).findIndex(function(value, index, arr) {
                    return value == target;
                })

                if(_this.currentNoteId) {
                    reverse(_this.fmarkList[_this.currentNoteId])
                }
                //取当前range的id,rangeInfo为最后一次的选取range
                let noteId = target.parentNode['data-id'];
                if(noteId.length == 0) {
                    return;
                }
                document.body.classList.add('hide-all-lines');
                let rangeInfo = _this.fmarkList[noteId[0]];

                _this.currentNoteId = noteId[0];
                //拼装评论信息给评论框
                let rangeInfos = {};
                for(let i = 0; i < noteId.length; i++) {
                    let id = noteId[i];
                    rangeInfos[id] = _this.fmarkList[noteId[i]];
                }

                //显示划线,弹出评论框
                Modal.showMarkComment((rangeInfo.position.right + rangeInfo.position.left)/2, rangeInfo.position.bottom, rangeInfos, function(currentDisplayId) {
                    _this.currentNoteId = currentDisplayId;
                }, function(rangeid) {
                    reverse(_this.fmarkList[rangeid]);

                    //从标记父级属性里删掉当前id
                    let parentIds = target.parentNode['data-id'];
                    let rangeIndex = parentIds.findIndex(function(value, index) {
                        return value == rangeid;
                    })
                    parentIds.splice(rangeIndex, 1);

                    //如果这时候noteIds为空,删除这个标记
                    if(parentIds.length == 0) {
                        let currentNode = document.getElementsByClassName('note-dot')[tag_index];
                        currentNode.parentNode.parentNode.removeChild(currentNode.parentNode);
                    }
                    delete _this.fmarkList[rangeid];
                    _this.currentNoteId = '';
                });
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
            if(this.fmarkList[key].position.right == currentRangeInfo.position.right && this.fmarkList[key].position.top == currentRangeInfo.position.top) {
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
                window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(location.href)}&type=icon&language=zh_cn&title=${currentRangeInfo.article_content.trim()} + -分享自${encodeURIComponent(location.href)}&style=simple`);
            }
            param = Object.assign(currentRangeInfo, {type: 2, discuss_content: data.msg, name: data.name});
            jsonp( _this.host + '/mark/add?' + encodeUrlParam(param), function(err, data) {
                _this.fmarkList[data.comment_id] = Object.assign(param, {id: data.comment_id, hasAuthor: true});
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

var mark = new FMark();
mark.bindEvent();
