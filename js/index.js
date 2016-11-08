'use strict';

/**
 * 批注组件
 */
class FMark {

    constructor() {
        this.ifDrag = false;
        this.mouseDownStartTime = Date.now();
        //标识,是否是mouseup事件后的点击事件
        this.isMouseUp = false;

        this.markPopup = undefined;
    }

    render() {}
    onMakeIt() {
        //todo 点击mark it 的回调
        console.log('aaa');
        this.hideMarkPopup();
    }
    initMarkPopup() {
        let _this = this;
        let markPopup = document.createElement('ul');
        markPopup.className = 'mark-it';
        markPopup.innerHTML = '<li class="mark-triangle"><i class="triangle"></i></li><li class="mark-note"><button class="note">Mark it!</button></li>'
        markPopup.onclick = function() {
            _this.onMakeIt();
        }
        document.body.appendChild(markPopup);
        this.markPopup = markPopup;
    }
    showMarkPopup(posX, posY) {
        if (!this.markPopup) {
            this.initMarkPopup();
        }
        //修正的像素是为了尖角在所想的位置
        this.markPopup.style.top = posY + 6 + 'px';
        this.markPopup.style.left = posX - 40  + 'px';
        this.markPopup.style.display = 'block';
    }
    hideMarkPopup() {
        this.markPopup.style.display = 'none';
    }
    bindEvent() {

        let _this = this;


        /**
         * 弹窗事件
         */
        $(document).on('click', function(e) {

            if(_this.isMouseUp) {
                _this.isMouseUp = false;
                return;
            }
            if($.contains($('.action-list')[0],e.target) || $('.action-list')[0] == e.target) {
                return;
            }
            $('.action-list').hide();
        })

        $(document).on('mouseover', '.rxl',  function(e) {

            console.log('----------------');
        })

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

            //选取时间大于400ms && 鼠标停止时所在元素不是html
            if(window.getSelection && _this.ifDrag && (Date.now() - _this.mouseDownStartTime > 400) && e.target !== $('html')[0]) {

                let selObj = window.getSelection(),
                    selRange = selObj.getRangeAt(0);

                console.log('Range', selRange, e);

                //选中区域有文字
                if(selObj.toString()) {

                    //起止文本在一个元素内
                    if(selRange.startContainer == selRange.endContainer) {
                        //兼容性IE9
                        selRange.surroundContents($('<rxl class="rxl"></rxl>')[0]);
                    }else {
                        //选中的文本是跨元素的,所以父级元素肯定有孩子元素
                        _this.transfer(selRange);
                    }

                    //TODO 挂载弹窗,最好是promise,需要位置绝对定位,e.clientX,e.clientY
                    _this.isMouseUp = true;
                    $('.action-list').show().css('top', e.clientY + 'px').css('left', e.clientX + 'px');

                }
            }
            $(document).off('mousemove');
            _this.ifDrag = false;
        })
    }

    /**
     * 将选取文本转换成特定样式
     * 问题: 长度少一,原因是找到了开始节点后添加了子节点,又遍历了子节点,导致子节点被减两次
     * 解决方法: 设置个flag,开始节点后跳过其子节点
     * @param range range对象
     * @returns {number}
     */
    transfer(range) {

        let startOffset = range.startOffset,
            startContainer = range.startContainer,
            //剩余长度
            restTextLen = $.trim(range.toString()).length,
            //第一次是公共父节点
            ancestorNode = range.commonAncestorContainer,
            //起止游标
            startSearched = false,
            endSearched = false;

        /**
         * 遍历节点渲染
         */
        let traversal = (currentNode) => {

            if (endSearched) return 2;

            if (currentNode == startContainer) {
                //深度遍历替换元素
                startSearched = true;
                let nextSibling = currentNode.splitText(startOffset);

                //判断长度,初始节点不可能和结束节点在同一个dom上
                restTextLen -= $.trim(nextSibling.nodeValue).length;
                changeNodeStyle(currentNode.nextSibling);
                //找到了开头,下一个循环
                return 1;
            }
            //已经找到开始节点,且当前节点是text节点,且不为空
            if (startSearched && currentNode.nodeType == 3 && currentNode.nodeValue.length > 0) {
                let normalTextLen = currentNode.nodeValue.length;

                //判断长度
                if (normalTextLen >= restTextLen) {
                    currentNode.splitText(restTextLen);
                    changeNodeStyle(currentNode);
                    endSearched = true;
                    //全都找完了,退出
                    return 2;
                } else {
                    restTextLen -= normalTextLen;
                    changeNodeStyle(currentNode);
                }
            }

            let nodes = currentNode.childNodes,
                flag = false;

            //遍历孩子节点
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                //flag阻止开始节点子节点的第二次计算
                if (flag) {
                    flag = false;
                    continue;
                }
                let result = traversal(node);
                if (result == 2) break;
                if (result == 1) {
                    flag = true;
                }
            }
        }

        /**
         * 改变选取区域样式
         */
        let changeNodeStyle = (node) => {
            let par = node.parentNode;
            let spanEle = document.createElement('rxl');
            spanEle.setAttribute('class', 'rxl');
            spanEle.appendChild(node.cloneNode(false));
            //使用替换节点的方法
            par.replaceChild(spanEle, node);
        }

        traversal(ancestorNode);

    }
}


let mark = new FMark();
mark.bindEvent();