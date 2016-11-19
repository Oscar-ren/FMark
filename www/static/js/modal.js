import {defered, getChildbyClass, hasContainNode} from './base';
import jsonp from 'jsonp';
import {EventUtil} from './base';
import querystring from 'querystring';

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
        let markModal = document.createElement('div');
        markModal.className = 'mark-modal';
        markModal.innerHTML = `<div class="mark-triangle"><i class="triangle"></i></div>
                               <div class="mark-wrap">
                                    <div><textarea class="mark-content" placeholder="你的批注"></textarea></div>
                                    <div class="share">分享到 
                                        <label><input class="share-weibo" type="radio" name="share" /><i class="mark-weibo"></i></label>
                                        <label><input class="share-qq" type="radio" name="share" /><i class="mark-qq"></i></label>
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
        let shareQQ  = getChildbyClass(markModal, 'share-qq');
        let shareWeibo = getChildbyClass(markModal, 'share-weibo');
        
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
                        // share = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(location.href)}&type=icon&language=zh_cn&title=${document.title}&pic=${share.pic}&searchPic=true&style=simple`;
                        share = 'weibo';
                    }
                    if (shareQQ.checked) {
                        // share = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(location.href)}&desc=${share.content}&title=${document.title}&summary=fqwva&pics=${share.pic}&style=203&otype=share`;
                        share = 'qq';
                    }
                    // share && window.open(share);
                    _this.popupDefer.resolve({code: 'mark', msg: markContent.value, name: markName.value, share: share});
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
    initMarkComment(rangeInfo) {
        let _this = this;
        if (!rangeInfo.length) {
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
        let html = '';
        rangeInfo.forEach(function(data, index) {
            html += '<ul class="comment-ul">';
            for (let index = 0; index < data.length; index++) {
                let item = data[index];
                html += `<li>
                            <div class="note-owner"><span class="author">${item.name}</span> 的批注</div>
                            <div class="note-content">${item.discuss_content}</div>
                            <div class="note-tools"><a class="thumbs" dicuss_id="${item.id}">${item.thumbs || ''}${item.thumbs?'取消赞':'赞'}</a></div>
                        </li>`;
            }
            html += '</ul>';

            if (data.length > 1) {

                html += `<p class="comment-page">
                            <span class="now">1</span>/<span class="all">${data.length}</span>
                        </p>`;
            }
            _this.commentWrap.innerHTML = html;
        }
        _this.commentWrap.onclick = function(e) {
            let targetClass = e.target.className;
            if (targetClass.indexOf('thumbs') > -1) {
                let id = e.target.getAttribute('dicuss_id');
                jsonp(_this.host + '/mark/thumbs?id=' + id, function(err, result) {
                    if (result) {
                        e.target.innerHTML = result; 
                    }
                })
            }
        }
    }
    showMarkComment(posX, posY, data) {
        this.initMarkComment(data);

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