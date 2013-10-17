define(["can/util/can","yui","can/util/event","can/util/fragment","can/util/array/each","can/util/object/isplain","can/util/deferred","can/util/hashchange"],function(can){var Y=can.Y=can.Y||YUI().use("*");can.trim=function(t){return Y.Lang.trim(t)},can.makeArray=function(t){return t?Y.Array(t):[]},can.isArray=Y.Lang.isArray,can.inArray=function(t,e){return e?Y.Array.indexOf(e,t):-1},can.map=function(t,e){return Y.Array.map(can.makeArray(t||[]),e)},can.extend=function(t){for(var e,n=t===!0?1:0,r=arguments[n],i=n+1;e=arguments[i];i++)Y.mix(r,e,!0,null,null,!!n);return r},can.param=function(t){return Y.QueryString.stringify(t,{arrayKey:!0})},can.isEmptyObject=function(t){return Y.Object.isEmpty(t)},can.proxy=function(){return Y.bind.apply(Y,arguments)},can.isFunction=function(t){return Y.Lang.isFunction(t)};var prepareNodeList=function(t){return t.each(function(e,n){t[n]=e.getDOMNode()}),t.length=t.size(),t};can.$=function(t){return t===window?window:t instanceof Y.NodeList?prepareNodeList(t):"object"!=typeof t||can.isArray(t)||"undefined"!=typeof t.nodeType||t.getDOMNode?prepareNodeList(Y.all(t)):t},can.get=function(t,e){return t._nodes[e]},can.append=function(t,e){t.each(function(t){"string"==typeof e&&(e=can.buildFragment(e,t)),t.append(e)})},can.addClass=function(t,e){return t.addClass(e)},can.data=function(t,e,n){return void 0===n?t.item(0).getData(e):t.item(0).setData(e,n)},can.remove=function(t){return t.remove()&&t.destroy()},can._yNodeDestroy=can._yNodeDestroy||Y.Node.prototype.destroy,Y.Node.prototype.destroy=function(){can.trigger(this,"destroyed",[],!1),can._yNodeDestroy.apply(this,arguments)},Y.NodeList.addMethod("destroy",Y.Node.prototype.destroy);var optionsMap={type:"method",success:void 0,error:void 0},updateDeferred=function(t,e){if(t&&t.io){var n=t.io;for(var r in n)e[r]="function"==typeof e[r]?function(){n[r].apply(n,arguments)}:r[n]}};can.ajax=function(options){var d=can.Deferred(),requestOptions=can.extend({},options);for(var option in optionsMap)void 0!==requestOptions[option]&&(requestOptions[optionsMap[option]]=requestOptions[option],delete requestOptions[option]);requestOptions.sync=!options.async;var success=options.success,error=options.error;requestOptions.on={success:function(transactionid,response){var data=response.responseText;"json"===options.dataType&&(data=eval("("+data+")")),updateDeferred(request,d),d.resolve(data),success&&success(data,"success",request)},failure:function(){updateDeferred(request,d),d.reject(request,"error"),error&&error(request,"error")}};var request=Y.io(requestOptions.url,requestOptions);return updateDeferred(request,d),d};var yuiEventId=0,addBinding=function(t,e,n,r){if(t instanceof Y.NodeList||!t.on||t.getDOMNode)t.each(function(t){var t=can.$(t),i=can.data(t,"events"),o=n+":"+e;i||can.data(t,"events",i={}),i[o]||(i[o]={}),void 0===r.__bindingsIds&&(r.__bindingsIds=yuiEventId++),i[o][r.__bindingsIds]=e?t.item(0).delegate(n,r,e):t.item(0).on(n,r)});else{var i=t,o=i.__canEvents=i.__canEvents||{};o[n]||(o[n]={}),void 0===r.__bindingsIds&&(r.__bindingsIds=yuiEventId++),o[n][r.__bindingsIds]=i.on(n,r)}},removeBinding=function(t,e,n,r){if(t instanceof Y.NodeList||!t.on||t.getDOMNode)t.each(function(t){var t=can.$(t),i=can.data(t,"events");if(i){var o=n+":"+e,a=i[o],s=a[r.__bindingsIds];s.detach(),delete a[r.__bindingsIds],can.isEmptyObject(a)&&delete i[n],can.isEmptyObject(i)}});else{var i=t,o=i.__canEvents||{},a=o[n],s=a[r.__bindingsIds];s.detach(),delete a[r.__bindingsIds],can.isEmptyObject(a)&&delete o[n],can.isEmptyObject(o)}};can.bind=function(t,e){return this.bind&&this.bind!==can.bind?this.bind(t,e):this.on||this.nodeType?addBinding(can.$(this),void 0,t,e):this.addEvent?this.addEvent(t,e):can.addEvent.call(this,t,e),this},can.unbind=function(t,e){return this.unbind&&this.unbind!==can.unbind?this.unbind(t,e):this.on||this.nodeType?removeBinding(can.$(this),void 0,t,e):can.removeEvent.call(this,t,e),this},can.trigger=function(t,e,n,r){t instanceof Y.NodeList&&(t=t.item(0)),t.getDOMNode&&(t=t.getDOMNode()),t.nodeName?(t=Y.Node(t),r===!1&&t.once(e,function(t){t.stopPropagation&&t.stopPropagation(),t.cancelBubble=!0,t._stopper&&t._stopper()}),realTrigger(t.getDOMNode(),e,{})):("string"==typeof e&&(e={type:e}),e.target=e.target||t,e.data=n,can.dispatch.call(t,e))},Y.mix(Y.Node.DOM_EVENTS,{destroyed:!0,foo:!0}),can.delegate=function(t,e,n){return this.on||this.nodeType?addBinding(can.$(this),t,e,n):this.delegate&&this.delegate(t,e,n),this},can.undelegate=function(t,e,n){return this.on||this.nodeType?removeBinding(can.$(this),t,e,n):this.undelegate&&this.undelegate(t,e,n),this};var leaveRe=/mouse(enter|leave)/,_fix=function(t,e){return"mouse"+("enter"==e?"over":"out")},realTrigger=document.createEvent?function(t,e,n){var r=document.createEvent("HTMLEvents");e=e.replace(leaveRe,_fix),r.initEvent(e,!0,!0),n&&can.extend(r,n),t.dispatchEvent(r)}:function(t,e,n){var r="on"+e,i=!1;e.toLowerCase();try{t.fireEvent(r)}catch(o){var a=can.extend({type:e,target:t,faux:!0,_stopper:function(){i=this.cancelBubble}},n);for(realTriggerHandler(t,e,a);!i&&t!==document&&t.parentNode;)t=t.parentNode,realTriggerHandler(t,e,a)}},realTriggerHandler=function(t,e,n){var r=Y.Node(t),i=can.Y.Event.getListeners(r._yuid,e);if(i)for(var o=0;o<i.length;o++)i[o].fire(n)};return can});