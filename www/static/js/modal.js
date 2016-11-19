import {defered, getChildbyClass, hasContainNode} from './base';
import jsonp from 'jsonp';
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
        markModal.innerHTML = '<div class="mark-triangle"><i class="triangle"></i></div><div class="mark-wrap"><p class="fmark-info"><span class="info">The FMark mark the best!</span><span class="close-btn" title="关闭">X</span></p>' +
            '<p><input class="mark-name" placeholder="显示名称"/></p>' +
            '<textarea class="mark-content" placeholder="mark it"></textarea>' +
            '<p><button class="fmark-btn" id="mark-btn">Mark</button></p></div>';

        document.body.appendChild(markModal);

        let markContent = _this.markContent = getChildbyClass(markModal, 'mark-content');
        let markName = _this.markName = getChildbyClass(markModal, 'mark-name');
        
        markModal.onclick = function(ev) {
            let targetClass = ev.target.className;
            if (targetClass.indexOf('close-btn') > -1) {
                _this.hideMarkModal();
                _this.popupDefer.reject();
            } else if (targetClass.indexOf('fmark-btn') > -1) {
                if (markContent.value) {
                    _this.hideMarkModal();
                    _this.popupDefer.resolve({code: 'mark', msg: markContent.value, name: markName.value});
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
    hideMarkModal() {
        this.markModal && (this.markModal.style.display = 'none');
        this.marking = false;
    }
    initMarkComment(id) {
        let _this = this;
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
        jsonp(_this.host+'/mark/getdiscuss?id='+id, function(err, result) {
            console.log(err, result);
            let html = '';
            if (result.length) {
                html += '<ul class="comment-ul">';
                for (let index = 0; index < result.length; index++) {
                    let item = result[index];
                    html += '<li>';
                    html += '<p>' + item.name + ' 的批注</p>';
                    html += '<p>' + item.discuss_content + '</p>';
                    html += '<p><span>赞</span></p>';
                }
                html += '</ul>';

                if (result.length > 1) {

                    html += '<p class="comment-page">';
                    html += '<span class="now">1</span>/<span class="all"></span>'
                    html += '</p>';
                }
            }
            _this.commentWrap.innerHTML = html;
        });
    }
    showMarkComment(posX, posY, id) {
        this.initMarkComment(id);

        this.markComment.style.top = posY + 6 + 'px';
        this.markComment.style.left = posX - 85  + 'px';
        this.markComment.style.display = 'block';
    }
    hideMarkComment(target) {
        if (target && this.markComment) {
            //从mouseup过来的，点击本身不关闭
            if (hasContainNode(this.markComment, target)) {
                return;
            }
        }
        this.markComment && (this.markComment.style.display = 'none');
    }
    initMarkPopup() {
        let _this = this;
        if (_this.markPopup) {
            return;
        }
        let markPopup = document.createElement('ul');
        markPopup.className = 'mark-it';
        markPopup.innerHTML = `<li class="mark-triangle"><i class="triangle"></i></li>
                               <li class="mark-note">
                                   <button class="cansel-underline">取消划线</button>
                               </li>
                               <li class="mark-note">
                                   <button class="make-underline">划线</button>
                               </li>
                               <li class="mark-note">
                                   <button class="markit">评论</button>
                               </li>`;
        
        document.body.appendChild(markPopup);
        this.markPopup = markPopup;
    }
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
                // messageIframe.window.postMessage({'code':'underline','markdata':_this.makedata(data)}, '*');
            } else if (targetClass.indexOf('cansel-underline') > -1) {
                defer.resolve({code: 'del-underline'});
                // messageIframe.window.postMessage({'code':'cansel-underline','markdata':_this.makedata(data)}, '*');
            } else if (targetClass.indexOf('markit') > -1) {
                _this.showMarkModal(posX, posY);
            }
        }
        //修正的像素是为了尖角在所想的位置
        if (hasline) {
            this.markPopup.className = 'mark-it hasline';
        } else {
            this.markPopup.className = 'mark-it';
        }
        this.markPopup.style.top = posY + 6 + 'px';
        this.markPopup.style.left = posX - 85  + 'px';
        this.markPopup.style.display = 'block';
        // underlineFrame.window.postMessage({'code':'markdata','markdata':data}, '*');
        // setTimeout(function() {
        //     _this.hideMarkPopup();
        // }, 1000 * 6);
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