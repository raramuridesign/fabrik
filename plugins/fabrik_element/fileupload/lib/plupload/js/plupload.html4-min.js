/*! Fabrik */

!function(a,p,v,e){function b(e){return p.getElementById(e)}v.runtimes.Html4=v.addRuntime("html4",{getFeatures:function(){return{multipart:!0,triggerDialog:v.ua.gecko&&a.FormData||v.ua.webkit}},init:function(f,e){f.bind("Init",function(d){var i,r,l,e,t,n,o,u=p.body,c=[],g=/MSIE/.test(navigator.userAgent),m=[],s=d.settings.filters;e:for(e=0;e<s.length;e++)for(t=s[e].extensions.split(/,/),o=0;o<t.length;o++){if("*"===t[o]){m=[];break e}(n=v.mimeTypes[t[o]])&&m.push(n)}m=m.join(","),d.settings.container&&(u=b(d.settings.container),"static"===v.getStyle(u,"position")&&(u.style.position="relative")),d.bind("UploadFile",function(e,t){var n;t.status!=v.DONE&&t.status!=v.FAILED&&e.state!=v.STOPPED&&(n=b("form_"+t.id),b("input_"+t.id).setAttribute("name",e.settings.file_data_name),n.setAttribute("action",e.settings.url),v.each(v.extend({name:t.target_name||t.name},e.settings.multipart_params),function(e,t){var i=p.createElement("input");v.extend(i,{type:"hidden",name:t,value:e}),n.insertBefore(i,n.firstChild)}),r=t,b("form_"+l).style.top="-1048575px",n.submit(),n.parentNode.removeChild(n))}),d.bind("FileUploaded",function(e){e.refresh()}),d.bind("StateChanged",function(e){var t;e.state==v.STARTED&&((t=p.createElement("div")).innerHTML='<iframe id="'+d.id+'_iframe" name="'+d.id+'_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>',i=t.firstChild,u.appendChild(i),v.addEvent(i,"load",function(e){var t,i,n=e.target;if(r){try{t=n.contentWindow.document||n.contentDocument||a.frames[n.id].document}catch(e){return void d.trigger("Error",{code:v.SECURITY_ERROR,message:v.translate("Security error."),file:r})}(i=t.body.innerHTML)&&(r.status=v.DONE,r.loaded=1025,r.percent=100,d.trigger("UploadProgress",r),d.trigger("FileUploaded",r,{response:i}))}},d.id)),e.state==v.STOPPED&&a.setTimeout(function(){v.removeEvent(i,"load",e.id),i.parentNode&&i.parentNode.removeChild(i)},0)}),d.bind("Refresh",function(e){var t,i,n,r,o,s,a,d;(t=b(e.settings.browse_button))&&(o=v.getPos(t,b(e.settings.container)),s=v.getSize(t),a=b("form_"+l),b("input_"+l),v.extend(a.style,{top:o.y+"px",left:o.x+"px",width:s.w+"px",height:s.h+"px"}),e.features.triggerDialog&&("static"===v.getStyle(t,"position")&&v.extend(t.style,{position:"relative"}),d=parseInt(t.style.zIndex,10),isNaN(d)&&(d=0),v.extend(t.style,{zIndex:d}),v.extend(a.style,{zIndex:d-1})),n=e.settings.browse_button_hover,r=e.settings.browse_button_active,i=e.features.triggerDialog?t:a,n&&(v.addEvent(i,"mouseover",function(){v.addClass(t,n)},e.id),v.addEvent(i,"mouseout",function(){v.removeClass(t,n)},e.id)),r&&(v.addEvent(i,"mousedown",function(){v.addClass(t,r)},e.id),v.addEvent(p.body,"mouseup",function(){v.removeClass(t,r)},e.id)))}),f.bind("FilesRemoved",function(e,t){var i,n;for(i=0;i<t.length;i++)(n=b("form_"+t[i].id))&&n.parentNode.removeChild(n)}),f.bind("Destroy",function(e){var t,i,n,r={inputContainer:"form_"+l,inputFile:"input_"+l,browseButton:e.settings.browse_button};for(t in r)(i=b(r[t]))&&v.removeAllEvents(i,e.id);v.removeAllEvents(p.body,e.id),v.each(c,function(e,t){(n=b("form_"+e))&&u.removeChild(n)})}),function r(){var o,s,e,a;l=v.guid(),c.push(l),(o=p.createElement("form")).setAttribute("id","form_"+l),o.setAttribute("method","post"),o.setAttribute("enctype","multipart/form-data"),o.setAttribute("encoding","multipart/form-data"),o.setAttribute("target",d.id+"_iframe"),o.style.position="absolute",(s=p.createElement("input")).setAttribute("id","input_"+l),s.setAttribute("type","file"),s.setAttribute("accept",m),s.setAttribute("size",1),a=b(d.settings.browse_button),d.features.triggerDialog&&a&&v.addEvent(b(d.settings.browse_button),"click",function(e){s.click(),e.preventDefault()},d.id),v.extend(s.style,{width:"100%",height:"100%",opacity:0,fontSize:"999px"}),v.extend(o.style,{overflow:"hidden"}),(e=d.settings.shim_bgcolor)&&(o.style.background=e),g&&v.extend(s.style,{filter:"alpha(opacity=0)"}),v.addEvent(s,"change",function(e){var t,i=e.target,n=[];i.value&&(b("form_"+l).style.top="-1048575px",t=(t=i.value.replace(/\\/g,"/")).substring(t.length,t.lastIndexOf("/")+1),n.push(new v.File(l,t)),d.features.triggerDialog?v.removeEvent(a,"click",d.id):v.removeAllEvents(o,d.id),v.removeEvent(s,"change",d.id),r(),n.length&&f.trigger("FilesAdded",n))},d.id),o.appendChild(s),u.appendChild(o),d.refresh()}()}),e({success:!0})}})}(window,document,plupload);