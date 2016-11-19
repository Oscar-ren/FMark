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

/**
 * ajax请求
 * @param type
 * @param url
 * @param data
 * @returns {Promise}
 */
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

function setCookie(c_name, value, expiredays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";path=/;expires=" + exdate.toGMTString());
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

/**
 * 字符串化请求数据,拼接成请求数据格式
 * @param markdata
 * @returns {string}
 */
let encodeUrlParam = (markdata) => {
    var data = [];
    for (var key in markdata) {
        var temp = typeof markdata[key] == 'object' ? JSON.stringify(markdata[key]) : markdata[key];
        data.push(key + '=' + temp);
    }
    return data.join('&');
}
/**
 * 获取节点的子元素
 * @param className
 */
let getChildbyClass = (node, className) => {
    let children = node.childNodes;
    if (!children.length) {
        return false;
    }
    for (let index = 0; index < children.length; index++) {
        if (children[index].className && children[index].className.indexOf(className) > -1) {
            return children[index];
        }
        let temp = getChildbyClass(children[index], className);
        if (temp) {
            return temp;
        }
    }
    return false;
}

/**
 * 获取延迟对象
 * @param 
 */
let defered = () => {
    let defer = {};
    defer.promise = new Promise(function(resolve, reject) {
        defer.resolve = function(data) {
            resolve(data);
        }
        defer.reject = function(data) {
            reject(data);
        }
    });
    return defer;
}
/**
 * 判断第二个节点是不是第一个节点的子元素
 * @param 
 */
 let hasContainNode = (parent, child) => {
    let children = parent.childNodes;
    if (!children.length) {
        return false;
    }
    for (let index = 0; index < children.length; index++) {
        if (children[index] == child) {
            return true;
        }
        let temp = hasContainNode(children[index], child);
        if (temp) {
            return temp;
        }
    }
    return false;
 }
export {EventUtil, getAjax, encodeUrlParam, setCookie, getCookie, getChildbyClass, defered, hasContainNode};