# 对后台返回数据结构不确定，通过递归进行各种数据兼容的回调函数，并且根据各种情况设定处理方法。
# 详情：
     描述 : 用于ajax成功或者失败后的回掉，弹出信息功能。
     配置：需要jquery和L框架中弹出tip插件。
     调用方法 : ajaxCallbackHint(true)(data,'state','info',true,'操作成功','操作失败',false);用于ajax.error下
               ajaxCallbackHint(false)(error,'state','info','',"操作成功","操作失败",false);用于ajax.error下
     参数 : ajaxCallbackHint（success）true为ajax的success回调，false为error的回调。
          在true的情况下 (arr, state ,info, checkState,successWord,errorWord,reload)
              arr         :后台传递过来的数组
              state       :为状态字段
              info        :提示信息字段
              checkState  :检测符合的状态
              successWord :成功的提示信息，后台没有传过来信息时候显示
              errorWord   :失败的提示信息，后台没有传过来信息时候显示
              reload      :
                    是否成功后刷新页面，
                    'close'为自动关闭，
                    'closeBtn'则弹出提示tip携带关闭按钮
                    'closeBtnSuc'为返回成功状态下，弹出提示tip携带关闭按钮
                    'closeBtnErr'为没有返回成功状态下，弹出提示tip携带关闭按钮
          在false的情况下 (arr, state, info, checkState,successWord,errorWord,sqlHint)
              sqlHint     :是否提示sql报错
     返回值 : 当操作成功，返回true，操作失败，返回false。（即使sql报错情况下，也返回true）

      * 测试所支持的各种情况的结果:
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
