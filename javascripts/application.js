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
		  $(this).addClass('ui-state-default ui-widget-content ui-corner-all')
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
			buttonImage:'stylesheets/flick/images/datepicker.gif',
			buttomImageOnly:true
			
		});
		
		// Interaction: Autocomplete controls
		// TODO: Add data-method to specify search method
		// TODO: Clear autocomplete on select
		$('.autocomplete:text').css('width','250px').autocomplete({
			source: function(request, response) {
				$.ajax({
					type:'POST',
					url:'search.cfc',
					data: {
						method:this.element.attr('data-method'),
						term:request.term
					},
					success:function(data, textStatus) {
						response(data);
					},
					dataType:'json'
				});
			},
			minLength: 3,
			select: function(event, ui) {
				$('<li></li>')
					.append(ui.item.value + ' - ' + ui.item.label)
					.appendTo('#counties-selected')
					.effect('highlight', {} ,2000);
					
				// TODO: Filter out already selected columns (or just don't add them)
				// TODO: Replace text field space (or add a reset button/graphic)
				
				//return false;
			}
			//change: function(event, ui) { return false; }
		});
		
		// TODO: Interaction: Add tooltip controls
		// Contains snippets from Data Dictionary
		
		// TODO: Interaction: Handle sort order events (trigger events)
		// Trigger: sort-direction-changed, includes Field, Sort Oder
		
		// TODO: Help: Add shadowbox video player for tutorial video
		
		// TODO: Interaction: Modal display while loading/rendering results
		
		// DEMO: Call API to deliver data
});

function fetchSampleData(yrStart,yrEnd,detected,chemCodes) {
	console.info("starting remote call");
	console.time("fetchSampleData");
	
	/* 
		Additional information about passing complex objects to CFC's remotely
		using jQuery can be found in this post:
		http://stackoverflow.com/questions/3999283
	*/
	var argumentCollection = {
		rpt_yr_range:{start:1985, end:1990},
		conc_gt:5,
		chem_in:[183]
	}
	
	$.ajax({
		type:'POST',
		url:'data.cfc',
		data: {
			method:'get_sample_data',
			argumentCollection: $.toJSON(argumentCollection)
		},
		success:function(data, textStatus) {
			console.info('data recieved');
			console.timeEnd("fetchSampleData");
		},
		error:function(request, textStatus, errorThrown) {
			console.info("an error was thrown");
		},
		dataType:'json'
	});
	
}