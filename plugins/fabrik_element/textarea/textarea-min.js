var FbTextarea=new Class({Extends:FbElement,initialize:function(b,a){this.plugin="fabriktextarea";this.parent(b,a);(function(){this.getTextContainer();this.watchTextContainer()}.bind(this)).delay(10000)},watchTextContainer:function(){if(typeOf(this.element)==="null"){this.element=document.id(this.options.element)}if(typeOf(this.element)==="null"){return}if(this.options.editable===true){var b=this.getContainer();if(b===false){fconsole("no fabrikElementContainer class found for textarea");return}var a=b.getElement(".fabrik_characters_left");if(typeOf(a)!=="null"){this.warningFX=new Fx.Morph(a,{duration:1000,transition:Fx.Transitions.Quart.easeOut});this.origCol=a.getStyle("color");if(this.options.wysiwyg){tinymce.dom.Event.add(this.container,"keyup",function(c){this.informKeyPress(c)}.bind(this))}else{this.container.addEvent("keydown",function(c){this.informKeyPress(c)}.bind(this))}}}},cloned:function(a){this.getTextContainer();this.watchTextContainer()},getTextContainer:function(){if(this.options.wysiwyg){var a=tinyMCE.get(this.options.element);if(a){this.container=a.getDoc()}else{fconsole("didnt find wysiwyg edtor ..."+this.options.element)}}else{this.element=document.id(this.options.element);this.container=this.element}},getContent:function(){if(this.options.wysiwyg){return tinyMCE.activeEditor.getContent().replace(/<\/?[^>]+(>|$)/g,"")}else{return this.container.value}},setContent:function(b){if(this.options.wysiwyg){var a=tinyMCE.getInstanceById(this.element.id).setContent(b);this.moveCursorToEnd();return a}else{this.getTextContainer();if(typeOf(this.container)!=="null"){this.container.value=b}}return null},moveCursorToEnd:function(){var a=tinyMCE.getInstanceById(this.element.id);a.selection.select(a.getBody(),true);a.selection.collapse(false)},informKeyPress:function(){var a=this.getContainer().getElement(".fabrik_characters_left");var b=this.getContent();charsLeft=this.itemsLeft();if(this.limitReached()){this.limitContent();this.warningFX.start({opacity:0,color:"#FF0000"}).chain(function(){this.start({opacity:1,color:"#FF0000"}).chain(function(){this.start({opacity:0,color:this.origCol}).chain(function(){this.start({opacity:1})})})})}else{a.setStyle("color",this.origCol)}a.getElement("span").set("html",charsLeft)},itemsLeft:function(){var a=0;var b=this.getContent();if(this.options.maxType==="word"){a=this.options.max-(b.split(" ").length)+1}else{a=this.options.max-(b.length+1)}if(a<0){a=0}return a},limitContent:function(){var b;var a=this.getContent();if(this.options.maxType==="word"){b=a.split(" ").splice(0,this.options.max);b=b.join(" ");b+=(this.options.wysiwyg)?"&nbsp;":" "}else{b=a.substring(0,this.options.max)}this.setContent(b)},limitReached:function(){var b=this.getContent();if(this.options.maxType==="word"){var c=b.split(" ");return c.length>this.options.max}else{var a=this.options.max-(b.length+1);return a<0?true:false}},reset:function(){this.update(this.options.defaultVal)},update:function(a){this.getElement();this.getTextContainer();if(!this.options.editable){this.element.set("html",a);return}this.setContent(a)}});