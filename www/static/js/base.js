/**
 * 兼容绑定事件
 * @type {{addHandler: EventUtil.addHandler, removeHandler: EventUtil.removeHandler, getEvent: EventUtil.getEvent, getTarget: EventUtil.getTarget}}
 */
let EventUtil = {
    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    }
};

let getAjax = function(type, url, data) {
    let promise = new Promise(function(resolve, reject) {

        let client;
        if (window.XMLHttpRequest) {
            client=new XMLHttpRequest();
        }else {
            client=new ActiveXObject("Microsoft.XMLHTTP");
        }

        client.open(type, url);
        client.onreadystatechange = handler;
        client.responseType = 'json';
        client.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        client.send(JSON.stringify(data));

        function handler() {
            if(this.readyState !== 4) return;
            if(this.status === 200) {
                resolve(this.response);
            }else {
                reject(this.statusText);
            }
        }
    })

    return promise;
}

export {EventUtil, getAjax};