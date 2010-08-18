$.fn.sortList = function() {
    var list = $(this);
    var listitems = list.children('li').get();
    listitems.sort(function(a, b) {
        var compA = $(a).text().toUpperCase();
        var compB = $(b).text().toUpperCase();
        return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    });
    $.each(listitems, function(idx, itm) { list.append(itm); });
    return this;
};

$.fn.toggleIcons = function(iconClasses) {
	var icon = $(this);

	$.each(iconClasses, function(idx, iconClass) {
		if(icon.hasClass(iconClass)) {
			icon.removeClass(iconClass)
				.addClass(iconClasses[(idx+1)%iconClasses.length]);
			
			//stop the loop
			return false;
		}
	});
};

$(function () {
		Cufon.replace('h2');
		
		$('h2').addClass('ui-corner-all');
		
		//order the available-fields list (in ascending order)
		$('#available-fields').sortList();
		
		//allow selected-fields list to be sorted
		$('#selected-fields').sortable({opacity:0.6});
		
		$('button.modal').button({icons:{primary:'ui-icon-newwin'}});
		$('button.run').button({icons:{primary:'ui-icon-transferthick-e-w'}});
		
		$('button.add-filter').button({icons:{primary:'ui-icon-newwin'}});
		/*.click(function() {
		  $('<div class="dialog">Filter details go here</div>').dialog({
		      modal:true,
			  width:460,
			  height:460,
			  autoOpen:true, 
			  title:'Add a filter to this query',
			  buttons:{
		          "Add":function() {$(this).dialog("close"); }
		      }
		  });
		});
		*/

		//list styling
		$('.fields li').each(function() {
		  $(this)
		      .addClass("ui-state-default ui-widget-content ui-corner-all")
		      .prepend('<span class="ui-widget-content ui-corner-all ui-icon ui-icon-close"></span>')
		      .prepend('<span class="wii-sort ui-widget-content ui-corner-all ui-icon ui-icon-triangle-2-n-s"></span>')
		      .prepend('<span class="ui-widget-content ui-corner-all ui-icon ui-icon-plus"></span>');
		});
		
		
		//ui hover interaction		
		$('.fields li').hover(
			function() {$(this).addClass('ui-state-active');}, 
			function() {$(this).removeClass('ui-state-active');}
		);
		
		//list manipulation
		$('.fields .ui-icon-plus').click(function() {
		  $(this).parent('li').appendTo('#selected-fields');
		});
		
		$('.fields .ui-icon-close').click(function() {
		  var list = $('#available-fields');
		  $(this).parent('li').appendTo(list);
		  list.sortList();
		});
		
				
		$('#selected-fields .wii-sort').live('click', function() {
			var iconClasses = [
				'ui-icon-triangle-2-n-s', 
				'ui-icon-triangle-1-s',
				'ui-icon-triangle-1-n'
			];
			$(this).toggleIcons(iconClasses);
		});
		
		//add report year slider
		$('.slider').slider({
			range:true,
			min:1982, 
			max:new Date().getFullYear(), 
			values:[1995, 2000],			
			
			slide:function(event, ui) {
				$(this).prev('p').find('.min.year').text(ui.values[0]);
				$(this).prev('p').find('.max.year').text(ui.values[1]);
			}
		});
		
		$('<input type="checkbox" />').prependTo('h3');
		
		$('.date:text').datepicker({
			buttonImage: 'stylesheets/flick/images/datepicker.gif',
			buttomImageOnly: true
			
		});
});