var FbThumbs=new Class({Extends:FbElement,initialize:function(c,b,a){this.field=document.id(c);this.parent(c,b);this.thumb=a;this.spinner=new Spinner(this.getContainer());if(Fabrik.bootstrapped){this.setupj3()}else{this.thumbup=document.id("thumbup");this.thumbdown=document.id("thumbdown");if(this.options.canUse){this.imagepath=Fabrik.liveSite+"plugins/fabrik_element/thumbs/images/";this.thumbup.addEvent("mouseover",function(d){this.thumbup.setStyle("cursor","pointer");this.thumbup.src=this.imagepath+"thumb_up_in.gif"}.bind(this));this.thumbdown.addEvent("mouseover",function(d){this.thumbdown.setStyle("cursor","pointer");this.thumbdown.src=this.imagepath+"thumb_down_in.gif"}.bind(this));this.thumbup.addEvent("mouseout",function(d){this.thumbup.setStyle("cursor","");if(this.options.myThumb==="up"){this.thumbup.src=this.imagepath+"thumb_up_in.gif"}else{this.thumbup.src=this.imagepath+"thumb_up_out.gif"}}.bind(this));this.thumbdown.addEvent("mouseout",function(d){this.thumbdown.setStyle("cursor","");if(this.options.myThumb==="down"){this.thumbdown.src=this.imagepath+"thumb_down_in.gif"}else{this.thumbdown.src=this.imagepath+"thumb_down_out.gif"}}.bind(this));this.thumbup.addEvent("click",function(d){this.doAjax("up")}.bind(this));this.thumbdown.addEvent("click",function(d){this.doAjax("down")}.bind(this))}else{this.thumbup.addEvent("click",function(d){d.stop();this.doNoAccess()}.bind(this));this.thumbdown.addEvent("click",function(d){d.stop();this.doNoAccess()}.bind(this))}}},setupj3:function(){var d=this.getContainer();var a=d.getElement("button.thumb-up");var b=d.getElement("button.thumb-down");a.addEvent("click",function(f){f.stop();if(this.options.canUse){var c=a.hasClass("btn-success")?false:true;this.doAjax("up",c);if(!c){a.removeClass("btn-success")}else{a.addClass("btn-success");if(typeOf(b)!=="null"){b.removeClass("btn-danger")}}}else{this.doNoAccess()}}.bind(this));if(typeOf(b)!=="null"){b.addEvent("click",function(f){f.stop();if(this.options.canUse){var c=b.hasClass("btn-danger")?false:true;this.doAjax("down",c);if(!c){b.removeClass("btn-danger")}else{b.addClass("btn-danger");a.removeClass("btn-success")}}else{this.doNoAccess()}}.bind(this))}},doAjax:function(a,c){c=c?true:false;if(this.options.editable===false){this.spinner.show();var b={option:"com_fabrik",format:"raw",task:"plugin.pluginAjax",plugin:"thumbs",method:"ajax_rate",g:"element",element_id:this.options.elid,row_id:this.options.row_id,elementname:this.options.elid,userid:this.options.userid,thumb:a,listid:this.options.listid,formid:this.options.formid,add:c};new Request({url:"",data:b,onComplete:function(f){f=JSON.decode(f);this.spinner.hide();if(f.error){console.log(f.error)}else{if(f!==""){if(Fabrik.bootstrapped){var i=this.getContainer();i.getElement("button.thumb-up .thumb-count").set("text",f[0]);if(typeOf(i.getElement("button.thumb-down"))!=="null"){i.getElement("button.thumb-down .thumb-count").set("text",f[1])}}else{var e=document.id("count_thumbup");var g=document.id("count_thumbdown");var d=document.id("thumbup");var h=document.id("thumbdown");e.set("html",f[0]);g.set("html",f[1]);this.getContainer().getElement("."+this.field.id).value=f[0].toFloat()-f[1].toFloat();if(f[0]==="1"){d.src=this.imagepath+"thumb_up_in.gif";h.src=this.imagepath+"thumb_down_out.gif"}else{d.src=this.imagepath+"thumb_up_out.gif";h.src=this.imagepath+"thumb_down_in.gif"}}}}}.bind(this)}).send()}},doNoAccess:function(){if(this.options.noAccessMsg!==""){alert(this.options.noAccessMsg)}}});