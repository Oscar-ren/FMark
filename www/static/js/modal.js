class Modal {
	constructor() {
		this.markPopup = undefined;
		this.markModal = undefined;
        this.host = 'http://localhost:8360';
	}

	onMakeIt(posX, posY, data) {
        //todo 点击mark it 的回调
        this.hideMarkPopup();
        this.showMarkModal(posX, posY, data);
    }
    initMarkPopup() {
        let _this = this;
        if (_this.markPopup) {
        	return;
        }
        let markPopup = document.createElement('ul');
        markPopup.className = 'mark-it';
        markPopup.innerHTML = '<li class="mark-triangle"><i class="triangle"></i></li><li class="mark-note">Mark it!</li>'
        
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
        markModal.innerHTML = '<div class="mark-triangle"><i class="triangle"></i></div><iframe class="mark-iframe" src="'+_this.host+'/mark"></iframe>';

        document.body.appendChild(markModal);
        this.markModal = markModal;
    }
    showMarkModal(posX, posY, data) {
    	if (!this.markModal) {
    		this.initMarkModal();
    	}

    	//修正的像素是为了尖角在所想的位置
        this.markModal.style.top = posY + 6 + 'px';
        this.markModal.style.left = posX - 150  + 'px';
        this.markModal.style.display = 'block';
    }
    showMarkPopup(posX, posY, data) {
        if (!this.markPopup) {
            this.initMarkPopup();
        }
        let _this = this;
        _this.markPopup.onclick = function() {
            _this.onMakeIt(posX, posY, data);
        }
        //修正的像素是为了尖角在所想的位置
        this.markPopup.style.top = posY + 6 + 'px';
        this.markPopup.style.left = posX - 38  + 'px';
        this.markPopup.style.display = 'block';
        setTimeout(function() {
            // _this.hideMarkPopup();
        }, 1000 * 4);
    }
    hideMarkPopup() {
        this.markPopup && (this.markPopup.style.display = 'none');
    }
}

export default new Modal()