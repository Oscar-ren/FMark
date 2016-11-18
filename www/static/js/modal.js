import {defered, getChildbyClass} from './util';

class Modal {
	constructor() {
		this.markPopup = undefined;
        this.popupDefer = undefined;
        this.markModal = undefined;
		this.markComment = undefined;
        this.host = 'http://www.fmark.com:8360';
        this.markCallback = undefined;
        this.marking = false;

        // let _this = this;

        // this.initMarkModal();
        // this.initHidenIframe();
        // window.addEventListener("message", function(e){ 
        //     if (e.data.code == 'hideModal') {
        //         _this.hideMarkModal();
        //     } else if (e.data.code == 'markit') {
        //         _this.hideMarkModal();
        //         _this.markCallback.call(null, e.data.id, e.data.msg);
        //     } else if (e.data.code == 'underline') {
        //         _this.hideMarkPopup();
        //         _this.markCallback.call(null, e.data.data.id);
        //     }
        // }, false);
	}
    initMarkPopup() {
        let _this = this;
        if (_this.markPopup) {
        	return;
        }
        let markPopup = document.createElement('ul');
        markPopup.className = 'mark-it';
        markPopup.innerHTML = '<li class="mark-triangle"><i class="triangle"></i></li><li class="mark-note cansel-underline">取消划线</li><li class="mark-note make-underline">划线</li><li class="mark-note markit">批注</li>'
        
        document.body.appendChild(markPopup);
        this.markPopup = markPopup;
    }
    initMarkModal() {
        let _this = this;
        if (_this.markModal) {
        	return;
        }
        let markModal = document.createElement('div');
        markModal.className = 'mark-modal';
        markModal.innerHTML = '<div class="mark-triangle"><i class="triangle"></i></div><div class="mark-wrap"><p class="fmark-info"><span class="info">The FMark mark the best!</span><span class="close-btn" title="关闭">X</span></p>' +
            '<textarea class="mark-content" placeholder="mark it"></textarea>' +
            '<p><button class="fmark-btn" id="mark-btn">Mark</button></p></div>';

        document.body.appendChild(markModal);

        let markContent = _this.markContent = getChildbyClass(markModal, 'mark-content');
        
        markModal.onclick = function(ev) {
            let targetClass = ev.target.className;
            if (targetClass.indexOf('close-btn') > -1) {
                _this.hideMarkModal();
                _this.popupDefer.reject();
            } else if (targetClass.indexOf('fmark-btn') > -1) {
                if (markContent.value) {
                    _this.hideMarkModal();
                    _this.popupDefer.resolve({code: 'mark', msg: markContent.value});
                }
            }
        }
        this.markModal = markModal;
    }
    // initHidenIframe() {
    //     let iframe = document.createElement('iframe');
    //     iframe.src = this.host + '/mark/iframe';
    //     iframe.style.display = 'none';
    //     iframe.name = 'messageIframe';

    //     document.body.appendChild(iframe);
    // }
    initMarkComment() {
        let _this = this;
        if (_this.markComment) {
            return;
        }
        let markComment = document.createElement('div');
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
        // fmarkFrame.window.postMessage({'code':'markdata','markdata':data}, '*');
    }
    hideMarkModal() {
        this.markModal && (this.markModal.style.display = 'none');
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
                _this.marking = true;
            }
            // _this.showMarkModal(posX, posY, data);
        }
        //修正的像素是为了尖角在所想的位置
        if (hasline) {
            this.markPopup.className = 'mark-it hasline';
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