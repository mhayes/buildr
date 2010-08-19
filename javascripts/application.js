$.fn.sort = function() {
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

$.fn.toggleSort = function() {
	var iconClasses = [
		'ui-icon-triangle-2-n-s', 
		'ui-icon-triangle-1-s',
		'ui-icon-triangle-1-n'
	];
	
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
		// Utility: Order available-fields in ascending order
		$('#available-fields').sort();
		
		// Style: Replace H2 fonts		
		Cufon.replace('h2');
		
		// Style: Modal button
		$('button.modal').button({
			icons:{primary:'ui-icon-newwin'}
		});
		
		// Style: Run button
		$('button.run').button({
			icons:{primary:'ui-icon-transferthick-e-w'}
		});
		
		// Style: List items
		$('.fields li').each(function() {
		  $(this)
		      .addClass("ui-state-default ui-widget-content ui-corner-all")
		      .prepend('<span class="ui-widget-content ui-corner-all ui-icon ui-icon-close"></span>')
		      .prepend('<span class="ui-custom-sorticon ui-widget-content ui-corner-all ui-icon ui-icon-triangle-2-n-s"></span>')
		      .prepend('<span class="ui-widget-content ui-corner-all ui-icon ui-icon-plus"></span>');
		});
		
		// Syle: List hovering		
		$('.fields li').hover(
			function() {$(this).addClass('ui-state-active');}, 
			function() {$(this).removeClass('ui-state-active');}
		);
				
		// Event: Add list item to display
		$('.fields .ui-icon-plus').click(function() {
		  $(this).parent('li').appendTo('#selected-fields').effect("highlight",{},2500);
		});
		
		// Event: Remove list item
		$('.fields .ui-icon-close').click(function() {
		  var list = $('#available-fields');
		  $(this).parent('li').appendTo(list).effect("highlight",{},2500);
		  list.sort();
		});
		
		// Event: Update sort icon direction
		$('#selected-fields .ui-custom-sorticon').live('click', 
			function() { 
				$(this).toggleSort(); 
			}
		);
		
		// Interaction: Activate filter controls
		$('<input type="checkbox" />')
			.prependTo('h3')
			.click(function() {
				$(this).parent('h3').effect('highlight',{},1000);
			}
		);
		
		// Interaction: Sortable controls
		$('#selected-fields').sortable({opacity:0.6});
		
		// Interaction: Slider controls
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
		
		// Interaction: Datepicker controls
		$('.date:text').datepicker({
			buttonImage: 'stylesheets/flick/images/datepicker.gif',
			buttomImageOnly: true
			
		});
		
		// Interaction: Autocomplete controls
		// TODO: Add data-method to specify search method
		$('.autocomplete:text').css('width','250px').autocomplete({
			source: 'search.cfc?method=search_pesticides',
			minLength: 5
		});
});