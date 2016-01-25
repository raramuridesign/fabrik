/*! Fabrik */
function fconsole(){if("undefined"!=typeof window.console){var a,b="";for(a=0;a<arguments.length;a++)b+=arguments[a]+" ";console.log(b)}}var RequestQueue=new Class({queue:{},initialize:function(){this.periodical=this.processQueue.periodical(500,this)},add:function(a){var b=a.options.url+Object.toQueryString(a.options.data)+Math.random();this.queue[b]||(this.queue[b]=a)},processQueue:function(){if(0!==Object.keys(this.queue).length){var a=!1;$H(this.queue).each(function(b,c){b.isSuccess()?(delete this.queue[c],a=!1):500===b.status&&(console.log("Fabrik Request Queue: 500 "+b.xhr.statusText),delete this.queue[c],a=!1)}.bind(this)),$H(this.queue).each(function(b){b.isRunning()||b.isSuccess()||a||(b.send(),a=!0)})}},empty:function(){return 0===Object.keys(this.queue).length}});Request.HTML=new Class({Extends:Request,options:{update:!1,append:!1,evalScripts:!0,filter:!1,headers:{Accept:"text/html, application/xml, text/xml, */*"}},success:function(a){var b=this.options,c=this.response;c.html=a.stripScripts(function(a){c.javascript=a});var d=c.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);d&&(c.html=d[1]);var e=$("<div />").html(c.html);if(c.tree=e.childNodes,c.elements=e.getElements(b.filter||"*"),b.filter&&(c.tree=c.elements),b.update){var f=document.id(b.update).empty();b.filter?f.adopt(c.elements):f.set("html",c.html)}else if(b.append){var g=document.id(b.append);b.filter?c.elements.reverse().inject(g):g.adopt(e.getChildren())}b.evalScripts&&Browser.exec(c.javascript),this.onSuccess(c.tree,c.elements,c.html,c.javascript)}}),Element.implement({keepCenter:function(){this.makeCenter(),window.addEvent("scroll",function(){this.makeCenter()}.bind(this)),window.addEvent("resize",function(){this.makeCenter()}.bind(this))},makeCenter:function(){var a=jQuery(window).width()/2-this.getWidth()/2,b=window.getScrollTop()+(jQuery(window).height()/2-this.getHeight()/2);this.setStyles({left:a,top:b})}}),Array.prototype.searchFor=function(a){var b;for(b=0;b<this.length;b++)if(0===this[b].indexOf(a))return b;return-1};var Loader=new Class({initialize:function(){this.spinners={},this.spinnerCount={}},sanitizeInline:function(a){return a=a?a:document.body,a instanceof jQuery?a=0===a.length?!1:a[0]:"null"===typeOf(document.id(a))&&(a=!1),a},start:function(a,b){if(a=this.sanitizeInline(a),b=b?b:Joomla.JText._("COM_FABRIK_LOADING"),this.spinners[a]||(this.spinners[a]=new Spinner(a,{message:b})),this.spinnerCount[a]?this.spinnerCount[a]++:this.spinnerCount[a]=1,1===this.spinnerCount[a])try{this.spinners[a].position().show()}catch(c){}},stop:function(a){if(a=this.sanitizeInline(a),this.spinners[a]&&this.spinnerCount[a]){if(this.spinnerCount[a]>1)return void this.spinnerCount[a]--;var b=this.spinners[a];Browser.ie&&Browser.version<9?b.hide():(b.destroy(),delete this.spinnerCount[a],delete this.spinners[a])}}});"undefined"==typeof Fabrik&&("undefined"!=typeof jQuery&&document.addEvent("click:relay(.popover button.close)",function(a,b){var c="#"+b.get("data-popover"),d=document.getElement(c);jQuery(c).popover("hide"),"null"!==typeOf(d)&&"input"===d.get("tag")&&(d.checked=!1)}),Fabrik={},Fabrik.events={},Fabrik.bootstrapVersion=function(a){a=a||"modal";var b=jQuery.fn[a];if(b){if(b.VERSION)return b.VERSION;if("modal"===a)return-1===b.toString().indexOf("bs.modal")?"2.x":"3.x"}},Fabrik.Windows={},Fabrik.loader=new Loader,Fabrik.blocks={},Fabrik.periodicals={},Fabrik.addBlock=function(a,b){Fabrik.blocks[a]=b,Fabrik.fireEvent("fabrik.block.added",[b,a])},Fabrik.getBlock=function(a,b,c){return c=c?c:!1,c&&(Fabrik.periodicals[a]=Fabrik._getBlock.periodical(500,this,[a,b,c])),Fabrik._getBlock(a,b,c)},Fabrik._getBlock=function(a,b,c){var d;if(b=b?b:!1,void 0!==Fabrik.blocks[a])d=a;else{if(b)return!1;var e=Object.keys(Fabrik.blocks),f=e.searchFor(a);if(-1===f)return!1;d=e[f]}return c&&(clearInterval(Fabrik.periodicals[a]),c(Fabrik.blocks[d])),Fabrik.blocks[d]},document.addEvent("click:relay(.fabrik_delete a, .fabrik_action a.delete, .btn.delete)",function(a,b){a.rightClick||Fabrik.watchDelete(a,b)}),document.addEvent("click:relay(.fabrik_edit a, a.fabrik_edit)",function(a,b){a.rightClick||Fabrik.watchEdit(a,b)}),document.addEvent("click:relay(.fabrik_view a, a.fabrik_view)",function(a,b){a.rightClick||Fabrik.watchView(a,b)}),document.addEvent("click:relay(*[data-fabrik-view])",function(a){if(!a.rightClick){var b,c,d;a.preventDefault(),c="a"===a.target.get("tag")?a.target:"null"!==typeOf(a.target.getElement("a"))?a.target.getElement("a"):a.target.getParent("a"),b=c.get("href"),b+=b.contains("?")?"&tmpl=component&ajax=1":"?tmpl=component&ajax=1",$H(Fabrik.Windows).each(function(a){a.close()}),d=c.get("title"),d||(d=Joomla.JText._("COM_FABRIK_VIEW"));var e={id:"view."+b,title:d,loadMethod:"xhr",contentURL:b};Fabrik.getWindow(e)}}),Fabrik.removeEvent=function(a,b){if(Fabrik.events[a]){var c=Fabrik.events[a].indexOf(b);-1!==c&&delete Fabrik.events[a][c]}},Fabrik.addEvent=Fabrik.on=function(a,b){Fabrik.events[a]||(Fabrik.events[a]=[]),Fabrik.events[a].contains(b)||Fabrik.events[a].push(b)},Fabrik.addEvents=function(a){var b;for(b in a)Fabrik.addEvent(b,a[b]);return this},Fabrik.fireEvent=Fabrik.trigger=function(a,b,c){var d=Fabrik.events;return this.eventResults=[],d&&d[a]?(b=Array.from(b),d[a].each(function(a){this.eventResults.push(c?a.delay(c,this,b):a.apply(this,b))},this),this):this},Fabrik.requestQueue=new RequestQueue,Fabrik.cbQueue={google:[]},Fabrik.loadGoogleMap=function(a,b){var c="https:"===document.location.protocol?"https:":"http:",d=c+"//maps.googleapis.com/maps/api/js?&sensor="+a+"&libraries=places&callback=Fabrik.mapCb",e=Array.from(document.scripts).filter(function(a){return a.src===d});if(0===e.length){var f=document.createElement("script");f.type="text/javascript",f.src=d,document.body.appendChild(f),Fabrik.cbQueue.google.push(b)}else Fabrik.googleMap?window[b]():Fabrik.cbQueue.google.push(b)},Fabrik.mapCb=function(){Fabrik.googleMap=!0;var a,b;for(b=0;b<Fabrik.cbQueue.google.length;b++)a=Fabrik.cbQueue.google[b],"function"===typeOf(a)?a():window[a]();Fabrik.cbQueue.google=[]},Fabrik.watchDelete=function(a,b){var c,d,e;if(e=a.target.getParent(".fabrik_row"),e||(e=Fabrik.activeRow),e){var f=e.getElement("input[type=checkbox][name*=id]");"null"!==typeOf(f)&&(f.checked=!0),d=e.id.split("_"),d=d.splice(0,d.length-2).join("_"),c=Fabrik.blocks[d]}else if(d=a.target.getParent(".fabrikList"),"null"!==typeOf(d))d=d.id,c=Fabrik.blocks[d];else{var g=b.getParent(".floating-tip-wrapper");if(g){var h=g.retrieve("list");d=h.id}else d=b.get("data-listRef");c=Fabrik.blocks[d],"floating"!==c.options.actionMethod||this.bootstrapped||c.form.getElements("input[type=checkbox][name*=id], input[type=checkbox][name=checkAll]").each(function(a){a.checked=!0})}c.submit("list.delete")||a.stop()},Fabrik.watchEdit=function(a,b){Fabrik.openSingleView("form",a,b)},Fabrik.watchView=function(a,b){Fabrik.openSingleView("details",a,b)},Fabrik.openSingleView=function(a,b,c){var d,e,f,g,h=jQuery(c).data("list"),i=Fabrik.blocks[h];if(i.options.ajax_links){b.preventDefault();var j=i.getActiveRow(b);if(j){i.setActive(j);var k=j.id.split("_").pop();f="A"===jQuery(b.target).prop("tagName")?jQuery(b.target):jQuery(b.target).find("a").length>0?jQuery(b.target).find("a"):jQuery(b.target).closest("a"),d=f.prop("href"),d+=d.contains("?")?"&tmpl=component&ajax=1":"?tmpl=component&ajax=1",g=f.prop("title"),e=f.data("loadmethod"),void 0===e&&(e="xhr"),jQuery(Fabrik.Windows,function(a,b){b.close()});var l={modalId:"ajax_links",id:h+"."+k,title:g,loadMethod:e,contentURL:d,width:i.options.popup_width,height:i.options.popup_height,onClose:function(){var b=a+"_"+i.options.formid+"_"+k;try{Fabrik.blocks[b].destroyElements(),Fabrik.blocks[b].formElements=null,Fabrik.blocks[b]=null,delete Fabrik.blocks[b];var c="details"===a?"fabrik.list.row.view.close":"fabrik.list.row.edit.close";Fabrik.fireEvent(c,[h,k,b])}catch(d){console.log(d)}}};l.id="details"===a?"view."+l.id:"add."+l.id,null!==i.options.popup_offset_x&&(l.offset_x=i.options.popup_offset_x),null!==i.options.popup_offset_y&&(l.offset_y=i.options.popup_offset_y),Fabrik.getWindow(l)}}},Fabrik.form=function(a,b,c){var d=new FbForm(b,c);return Fabrik.addBlock(a,d),d},window.fireEvent("fabrik.loaded"));