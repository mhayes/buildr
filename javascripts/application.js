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

$(function () {
		// Utility: Order available-fields in ascending order
		$('#available-fields').sort();
		
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
		      .prepend('<span class="ui-widget-content ui-corner-all ui-icon ui-icon-info"></span>')
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
				
		// Interaction: Activate filter controls
		$('<input type="checkbox" />')
			.prependTo('h3')
			.click(function() {
				$(this).parent('h3').effect('highlight',{},1000);
				$.jGrowl($(this).parent('h3').text() + " now active", {header:"Activated Filter"});
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
		// TODO: Clear autocomplete on select
		$(':input[name^=filter-].autocomplete').each(function() {
			$(this).autocomplete({
				source: 'search/' + $(this).attr('data-method') + '.js',
				minLength: 2,
				select: function(event, ui) {
					console.log("event occured");
					$('<li></li>')
						.append(ui.item.value + ' - ' + ui.item.label)
						.appendTo('ul#selected-' + $(this).attr('data-method'))
						.effect('highlight', {}, 2000);
				}
			});
		});
		
		/*
		$('.multiselect').each(function() {
			$(this).multiselect({multiple:$(this).attr('multiple'), selectedText:"Hello world"});
		});
		*/
		
		$(':input[name=operator-sample-date]').change(function() {
			mythis = $(this);
			if($(this).val() == "bt") {
				// setup range filter
				$(":input[name=filter-sample-date-end]").show();
			} else {
				// setup single filter
				$(":input[name=filter-sample-date-end]").hide();
			}
		});
		
		// TODO: Interaction: Add tooltip controls
		// Contains snippets from Data Dictionary
		
		// TODO: Interaction: Handle sort order events (trigger events)
		// Trigger: sort-direction-changed, includes Field, Sort Oder
		
		// TODO: Help: Add shadowbox video player for tutorial video
		
		// TODO: Interaction: Modal display while loading/rendering results
});