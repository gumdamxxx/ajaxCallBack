/**
 * 描述 : 用于ajax成功或者失败后的回掉，弹出信息功能，弹出信息给予L框架中弹出插件。
 * 调用方法 : ajaxCallbackHint(true)(data,'state','info',true,'操作成功','操作失败',false);
 *           ajaxCallbackHint(false)(error,'state','info','',"操作成功","操作失败",false);
 * 参数 : ajaxCallbackHint（success）true为ajax的success回调，false为error的回调。
 *      在true的情况下 (arr, state ,info, checkState,successWord,errorWord,reload)
 *          arr         :后台传递过来的数组
 *          state       :为状态字段
 *          info        :提示信息字段
 *          checkState  :检测符合的状态
 *          successWord :成功的提示信息，后台没有传过来信息时候显示
 *          errorWord   :失败的提示信息，后台没有传过来信息时候显示
 *          reload      :是否成功后刷新页面 close为自动关闭
 *      在false的情况下 (arr, state, info, checkState,successWord,errorWord,sqlHint)
 *          sqlHint     :是否提示sql报错
 * 返回值 : 当操作成功，返回true，操作失败，返回false。（即使sql报错情况下，也返回true）,
 * 所支持的各种情况的结果:
 *      $data = {state: 300, info: ""};//结果是  申请失败
 *      $data = {state: 300, info : []};//结果是  申请失败
 *      $data = {state: 200, info: ""};//结果是  申请成功
 *      $data = {state: 200, info:[]};//结果是  申请成功
 *      $data = {state: "", info:[]};//结果是  申请失败
 *      $data = {state: [], info:[]};//结果是  申请失败
 *      $data = {info:[]};//结果是  申请失败
 *      $data = {info:""};//结果是  申请失败
 *      $data = {info:"订单在海外仓ERP不为新录入状态"};//结果是  订单在海外仓ERP不为新录入状态
 *      $data = {info:["订单在海外仓ERP不为新录入状态"]};//结果是  订单在海外仓ERP不为新录入状态
 *      $data = {info:["订单在海外仓ERP不为新录入状态","订单在海外仓ERP不为新录入状态2"]};//结果是  订单在海外仓ERP不为新录入状态,订单在海外仓ERP不为新录入状态2
 *      $data = {state: 200,info:["订单在海外仓ERP不为新录入状态","订单在海外仓ERP不为新录入状态2"]};//结果是  订单在海外仓ERP不为新录入状态,订单在海外仓ERP不为新录入状态2
 *      $data = {state: 300,info:["订单在海外仓ERP不为新录入状态","订单在海外仓ERP不为新录入状态2"]};//结果是  订单在海外仓ERP不为新录入状态,订单在海外仓ERP不为新录入状态2
 *      $data = {state: 200, info: "订单在海外仓ERP不为新录入状态,不可修改"}; //结果是 订单在海外仓ERP不为新录入状态,不可修改
 *      $data = {state: 300, info: "订单在海外仓ERP不为新录入状态,不可修改"};//结果是 订单在海外仓ERP不为新录入状态,不可修改
 *      $data = {state: 300,info:[{sku:"A301",goods:"一个sku"},{sku:"A303",goods:"一个sku2"}]};//结果是  sku:"A301",goods:"一个sku"   sku:"A303",goods:"一个sku2"
 *      $data = {state: 300,info:["A304",{sku:"A303",goods:"一个sku2"}]};//结果是  A301   sku:"A303",goods:"一个sku2"
 *      $data = {state: 200,info:["A304",{sku:"A303",goods:"一个sku2"}]};//结果是  A301   sku:"A303",goods:"一个sku2"
 *      $data = {state: 200,info:["A304",{sku:["A304","A305"],goods:"一个sku2"}]};//结果是  A301   sku:"A303" "A305" , goods:"一个sku2"
 * 作者 : liubibo
 */
function ajaxCallbackHint(success) {
    var thisFun = arguments.callee;
    thisFun.successCallback = function (arr, state, info, checkState, successWord, errorWord, reload) {
        var closeType = typeof reload === "string" ? reload.match(/closeBtn(\w*)/) : "";
        var time;
        if (!!arr[state] && ( !checkState || arr[state] == checkState )) {
            if (!!closeType && !closeType[1]) {
                time = false;
            } else if (!!closeType && closeType[1] === "Suc") {
                time = false;
            } else {
                time = !!parseFloat(reload) ? parseFloat(reload) : "";
            }
            thisFun.differentData(arr, info, successWord, time);
            if (!!reload) {
                if (reload === "close") {
                    setTimeout(function () {
                        var tempObj = L.open('oDialogDiv').getTreeNode();
                        L.open('oDialogDiv').dialogClose(tempObj[tempObj.length - 1].handle);
                    }, 1200);
                } else if (reload === true) {
                    setTimeout(function () {
                        window.location.reload()
                    }, 1200);
                }
            }
            return true;
        } else {
            if (!!closeType && !closeType[1]) {
                time = false;
            } else if (!!closeType && closeType[1] === "Err") {
                time = false;
            } else {
                time = !!parseFloat(reload) ? parseFloat(reload) : "";
            }
            thisFun.differentData(arr, info, errorWord, time);
            return false;
        }
    };
    thisFun.errorCallback = function (arr, state, info, checkState, successWord, errorWord, reload, sqlHint) {
        var regex = /(\{.*?\})/g;
        var result = arr.responseText.match(regex);
        var sqlHint = !!sqlHint ? " sql报错" : '';
        if (!!result) {                                                                                                 //查看后台返回中是否有state为true
            var tempObj = JSON.parse(result[0]);
            if (!!tempObj[checkState]) {
                thisFun.differentData(arr, info, successWord + sqlHint);
                if (reload == "close") {
                    setTimeout(function () {
                        var tempObj = L.open('oDialogDiv').getTreeNode();
                        L.open('oDialogDiv').dialogClose(tempObj[tempObj.length - 1].handle);
                    }, 1200);
                } else if (!!reload) {
                    setTimeout(function () {
                        window.location.reload()
                    }, 1200);
                }
                return true;
            } else {
                thisFun.differentData(arr, info, errorWord);
                return false;
            }
        } else {                                                                                                        //当后台内容中，没有state为true的情况，直接弹出保存失败
            thisFun.differentData(arr, info, errorWord + sqlHint);
            return false;
        }
    };
    /**
     * 描述 : 用于检测是否是空，如果是空返回true，否则返回false
     */
    thisFun.checkEmpty = function (objVal) {
        if (objVal === undefined || objVal === null || objVal === "") {
            return true;
        } else if ($.isArray(objVal)) {
            if (objVal.length === 0) {
                return true;
            }
        } else if (typeof objVal === "object" && objVal.constructor.name === "Object") {
            for (var key in objVal) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    };
    /**
     * 描述 : 用于后台传过来的提示信息不同情况下，要进行不同的处理，不然会js报错。
     * 作者 : liubibo
     */
    thisFun.differentData = function (arr, info, errorWord, time) {
        var time = time === false ? time : !!parseFloat(time) ? parseFloat(time) : 2000;
        var tempDiv = $('<div class="tempDiv"></div>');
        var closeBtn = "";
        var $body = $(L.open('oDialogDiv').getAncestorWindow().document.body);
        if (time === false) {
            closeBtn = $("<input class='btn btn-default btn-xs close-btn' " +
                "style='text-align:center; position:absolute;top:2px;right:2px;width:16px;height:16px;" +
                "font-size:14px;line-height:12px;padding:1px;border-radius:50%;' " +
                "type='button' value='×' />").appendTo(tempDiv);                                                        //添加关闭按钮到tempDiv里面
            $body.on('click.closeTip', '.close-btn', function () {
                $body.off('click.closeTip');
                window.L.open('tip')();
            });
        }
        if (!arr[info]) {
            tempDiv.append($('<div>' + errorWord + '</div>'));
            window.L.open('tip')(tempDiv.get(0).outerHTML, time);
            return false;
        } else if (typeof arr[info] === "string") {
            tempDiv.append($('<div>' + arr[info] + '</div>'));
            window.L.open('tip')(tempDiv.get(0).outerHTML, time);
        } else if (($.isArray(arr[info]) && arr[info].length) ||
            (arr[info].constructor.name === "Object" && !thisFun.checkEmpty(arr[info]))) {
            tempDiv.append(thisFun.multiKey(arr[info]));
            window.L.open('tip')(tempDiv.get(0).outerHTML, time);
            return false;
        } else {
            tempDiv.append($('<div>' + errorWord + '</div>'));
            window.L.open('tip')(tempDiv.get(0).outerHTML, time);
            return false;
        }
    };
    thisFun.multiKey = function (objOrArr) {
        if ($.isArray(objOrArr) && objOrArr.length) {
            var tempDiv = $("<div class='errorDiv'></div>");
            for (var i = 0, l = objOrArr.length; i < l; i++) {
                var tempHTML = arguments.callee(objOrArr[i]);
                tempDiv.append(tempHTML);
            }
            return tempDiv;
        } else if (objOrArr.constructor.name === "Object" && !thisFun.checkEmpty(objOrArr)) {
            var tempSpan = $("<div class='objectDiv'></div>");
            for (var key in objOrArr) {
                var tempUnit = $("<div class='objectUnit'></div>");
                var tempKey = $("<span class='small-padding objectKey'></span>");
                var tempVal = $("<span class='objectVal'></span>");
                var tempHTML = arguments.callee(objOrArr[key]);
                var space = $('<span>: </span>');
                tempKey.text(key);
                tempUnit.append(tempKey);
                tempUnit.append(space);
                tempVal.append(tempHTML);
                tempUnit.append(tempVal);
                tempSpan.append(tempUnit);
            }
            return tempSpan;
        } else {
            var tempString = $("<span class=stringDiv></span>");
            tempString.text(objOrArr);
            return tempString;
        }
    };
    if (!!success) {
        return thisFun.successCallback;
    } else {
        return thisFun.errorCallback;
    }
}
