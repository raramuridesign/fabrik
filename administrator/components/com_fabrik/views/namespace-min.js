/*! Fabrik */

"object"!==typeOf(window.FabrikAdmin)&&(FabrikAdmin={model:{fields:{fabriktable:{},element:{}}},reTip:function(){$$(".hasTip").each(function(e){var t=e.get("title");if(t){var i=t.split("::",2);e.store("tip:title",i[0]),e.store("tip:text",i[1])}}),new Tips($$(".hasTip"),{maxTitleChars:50,fixed:!1}),[].slice.call(document.querySelectorAll(".FabrikAdminLabel")).map(function(e){return new bootstrap.Tooltip(e)})}},window.fireEvent("fabrik.admin.namespace")),"undefined"!=typeof jQuery&&function(a){a(document).on("click",".btn-group label:not(.active)",null,function(e){var t=a(this),i=a("#"+t.attr("for"));i.prop("checked")||(t.closest(".btn-group").find("label").removeClass("active btn-success btn-danger btn-primary"),""===i.val()?t.addClass("active btn-primary"):0===i.val().toInt()?t.addClass("active btn-danger"):t.addClass("active btn-success"),i.prop("checked",!0),i.trigger("change"))})}(jQuery);