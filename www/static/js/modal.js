import {defered, getChildbyClass, hasContainNode, toSafeStr} from './base';
import jsonp from 'jsonp';
import {traversalStartLen, transfer, reverse} from './util';
import {EventUtil} from './base';

class Modal {
	constructor() {
		this.markPopup = undefined;
        this.popupDefer = undefined;
        this.markModal = undefined;
		this.markComment = undefined;
        this.markCallback = undefined;
        this.marking = false;

        this.host = 'http://www.fmark.com:8360';
	}
    initMarkModal() {
        let _this = this;
        if (_this.markModal) {
        	return;
        }
        let maxLength = 255;
        let markModal = document.createElement('div');
        markModal.className = 'mark-modal';
        markModal.innerHTML = `<div class="mark-triangle"><i class="triangle"></i></div>
                               <div class="mark-wrap">
                                    <div class="content-wrap">
                                        <textarea class="mark-content" placeholder="你的批注"></textarea>
                                        <div class="count-wrap"><span class="now-count">0</span>/${maxLength}</div>
                                    </div>
                                    <div class="share">分享到 
                                        <label><input class="share-weibo" type="checkbox" name="share" /><i class="mark-weibo"></i></label>
                                    </div>
                                    <div class="tool-bar">
                                        <input class="mark-name" placeholder="请填入名称"/>
                                        <div class="pull-right">
                                            <a class="close-btn">取消</a>
                                            <button class="fmark-btn" id="mark-btn">Mark</button>
                                        </div>
                                    </div>
                                </div>`;

        document.body.appendChild(markModal);

        let markContent = _this.markContent = getChildbyClass(markModal, 'mark-content');
        let markName = _this.markName = getChildbyClass(markModal, 'mark-name');
        let shareWeibo = getChildbyClass(markModal, 'share-weibo');
        let nowCount = _this.nowCount = getChildbyClass(markModal, 'now-count');
        markContent.onkeyup = function(ev) {
            markContent.style.borderColor = '';
            let length = markContent.value.length;
            if (length <= maxLength) {
                nowCount.innerHTML = length;
            } else {
                markContent.value = markContent.value.slice(0, maxLength);
                nowCount.innerHTML = maxLength;
            }
        }
        markModal.onclick = function(ev) {
            let targetClass = ev.target.className;
            if (targetClass.indexOf('close-btn') > -1) {
                _this.hideMarkModal();
                _this.popupDefer.reject();
            } else if (targetClass.indexOf('fmark-btn') > -1) {
                if (markContent.value) {
                    _this.hideMarkModal();
                    let share = '';
                    if (shareWeibo.checked) {
                        share = 'weibo';
                    }
                    // share && window.open(share);
                    _this.popupDefer.resolve({code: 'mark', msg: markContent.value, name: markName.value, share: share});
                } else {
                    _this.markContent.focus();
                    _this.markContent.style.borderColor = 'red';
                }
            }
        }
        this.markModal = markModal;
    }
    showMarkModal(posX, posY) {
    	if (!this.markModal) {
    		this.initMarkModal();
    	}
        this.markContent.value = '';
        this.markContent.style.borderColor = '';
        this.nowCount.innerHTML = '0';
    	//修正的像素是为了尖角在所想的位置
        this.markModal.style.top = posY + 6 + 'px';
        this.markModal.style.left = posX - 150  + 'px';
        this.markModal.style.display = 'block';
        this.markContent.focus();

        this.marking = true;
        // fmarkFrame.window.postMessage({'code':'markdata','markdata':data}, '*');
    }
    hideMarkModal(target) {
        if (target && this.markModal) {
            //从mouseup过来的，点击本身不关闭
            if (hasContainNode(this.markModal, target)) {
                return false;
            }
            if (this.markModal.style.display == 'block') {
                this.popupDefer.reject();
            }
        }
        this.markModal && (this.markModal.style.display = 'none');
        this.marking = false;
    }
    initMarkComment(rangeInfo, callback, deletecomment) {
        let _this = this;
        if (!Object.keys(rangeInfo).length) {
            return;
        }
        if (_this.markComment) {
            
        } else {
            let markComment = document.createElement('div');
            markComment.className = 'mark-comment'
            markComment.innerHTML = '<div class="mark-triangle"><i class="triangle"></i></div>';
            let commentWrap = document.createElement('div');
            commentWrap.className = 'comment-iframe';
            markComment.appendChild(commentWrap);
            document.body.appendChild(markComment);

            this.markComment = markComment;
            this.commentWrap = commentWrap;
        }
        // _this.commentWrap.innerHTML = '<img src="'+this.host+'/static/img/loading.jpg">';
        let data = [];
        for(let key in rangeInfo) {
            data = data.concat(rangeInfo[key].discuss);
        }
        let html = '';html += '<ul class="comment-ul">';
        for (let index = 0; index < data.length; index++) {
            let item = data[index];
            html += `<li class="comment-li ${index==0?'active':''}">
                        <div class="note-owner"><span class="author">${toSafeStr(item.name)}</span> 的批注</div>
                        <div class="note-content">${toSafeStr(item.discuss_content)}</div>
                        <div class="note-tools">
                            <a class="thumbs" dicuss_index="${index}">${item.thumbs || ''}${item.hasThumbs?'取消赞':'赞'}</a>
                            <span class="del-wrapper">
                                <span>·</span>
                                <a class="del-note" dicuss_index="${index}">删除</a>
                            </span>
                        </div>
                    </li>`;
        }
        html += '</ul>';

        if (data.length > 1) {
            html += `<p class="comment-page">
                        <span class="now">1</span>/<span class="all">${data.length}</span><span class="page-prev disable"></span><span class="page-next"></span>
                    </p>`;
        }
        _this.commentWrap.innerHTML = html;

        let now = getChildbyClass(_this.commentWrap, 'now');
        let pagePrev = getChildbyClass(_this.commentWrap, 'page-prev');
        let pageNext = getChildbyClass(_this.commentWrap, 'page-next');
        let commentUl = getChildbyClass(_this.commentWrap, 'comment-ul');
        let nowPage = 1;
        let showPage = (page) => {
            now.innerHTML = page;
            commentUl.childNodes.forEach(function(item, index) {
                if (item.className.indexOf('active') > -1) {
                    item.className = item.className.replace('active', '');
                    reverse(rangeInfo[data[index].comment_id]);
                }
                if (index == (page-1)) {
                    //划线,给回调当前的信息id
                    transfer(rangeInfo[data[index].comment_id]);
                    if(callback instanceof Function) {
                        callback(data[index].comment_id);
                    }
                    item.className += ' active';
                }
            });
        }
        //第一次划线，以后的都在showPage里划线
        transfer(rangeInfo[data[0].comment_id]);

        _this.commentWrap.onclick = function(e) {
            let targetClass = e.target.className;
            if (targetClass.indexOf('thumbs') > -1) {
                let index = e.target.getAttribute('dicuss_index');
                let id = data[index].id;
                jsonp(_this.host + '/mark/thumbs?id=' + id, function(err, result) {
                    if (result) {
                        e.target.innerHTML = (result.thumbs || '') + result.code;
                        data[index].thumbs = result.thumbs;
                        data[index].hasThumbs = result.code == '赞'? 0:1;
                    }
                })
            } else if (targetClass.indexOf('del-note') > -1) {
                let index = e.target.getAttribute('dicuss_index');
                let id = data[index].id;
                let comment_id = data[index].comment_id;
                jsonp(_this.host + '/mark/deletecomment?id=' + comment_id, function(err, result) {
                    if (result) {
                        deletecomment(comment_id);
                        _this.hideMarkComment();
                    }
                })
            } else if (targetClass.indexOf('disable') > -1) {
                return;
            } else if (targetClass.indexOf('page-prev') > -1) {
                if (nowPage > 2) {
                    nowPage--;
                } else {
                    nowPage = 1;
                    if (pagePrev.className.indexOf('disable') < 0) {
                        pagePrev.className += ' disable';
                    }
                }
                pageNext.className = pageNext.className.replace('disable', '');
                showPage(nowPage);
            } else if (targetClass.indexOf('page-next') > -1) {
                if (nowPage < data.length - 1) {
                    nowPage++;
                } else {
                    nowPage = data.length;
                    if (pageNext.className.indexOf('disable') < 0) {
                        pageNext.className += ' disable';
                    }
                }
                pagePrev.className = pagePrev.className.replace('disable', '');
                showPage(nowPage);
            }
        }
    }
    showMarkComment(posX, posY, data, callback, deletecomment) {
        this.initMarkComment(data, callback, deletecomment);

        this.markComment.style.top = posY + 6 + 'px';
        this.markComment.style.left = posX - 150  + 'px';
        this.markComment.style.display = 'block';
    }
    hideMarkComment(target) {
        if (target && this.markComment) {
            //从mouseup过来的，点击本身不关闭
            if (hasContainNode(this.markComment, target)) {
                return false;
            }
        }
        this.markComment && (this.markComment.style.display = 'none');
        return true;
    }
    //初始化功能框
    initMarkPopup() {
        let _this = this;
        if (_this.markPopup) {
            return;
        }
        let markPopup = document.createElement('ul');
        markPopup.className = 'mark-it';
        markPopup.innerHTML = `<li class="mark-triangle"><i class="triangle"></i></li>
                               <li class="mark-note del">
                                   <button class="cancel-underline">取消划线</button>
                               </li>
                               <li class="mark-note underline">
                                   <button class="make-underline">划线</button>
                               </li>
                               <li class="mark-note note">
                                   <button class="markit">评论</button>
                               </li>`;
        
        document.body.appendChild(markPopup);
        this.markPopup = markPopup;
    }

    //展示功能框
    showMarkPopup(posX, posY, hasline) {
        if (!this.markPopup) {
            this.initMarkPopup();
        }
        let _this = this;
        let defer = defered();
        _this.popupDefer = defer;
        _this.markPopup.onclick = function(ev) {
            let targetClass = ev.target.className;
            if (targetClass.indexOf('make-underline') > -1) {
                defer.resolve({code: 'underline'});
            } else if (targetClass.indexOf('cancel-underline') > -1) {
                defer.resolve({code: 'del-underline'});
            } else if (targetClass.indexOf('markit') > -1) {
                _this.showMarkModal(posX, posY);
                ev.stopPropagation();
                return false;
            }
        }
        //修正的像素是为了尖角在所想的位置
        if (hasline) {
            this.markPopup.className = 'mark-it hasline';
            this.markPopup.style.left = posX - 65.5  + 'px';
        } else {
            this.markPopup.className = 'mark-it';
            this.markPopup.style.left = posX - 54.5  + 'px';
        }

        //算弹窗宽度
        this.markPopup.style.top = posY + 6 + 'px';
        this.markPopup.style.display = 'block';
        return defer.promise;
    }
    hideMarkPopup(hasResolve) {
        if (this.markPopup && this.markPopup.style.display == 'block') {
            this.markPopup.style.display = 'none';

            let _this = this;
            setTimeout(function() {
                _this.popupDefer && !_this.marking && _this.popupDefer.reject();
            }, 100);
        }
    }
}

export default new Modal()