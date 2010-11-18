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
				var checkboxInput = $(this);
				checkboxInput.parent('h3').effect('highlight',{},1000);
				var headerText = checkboxInput.is(':checked') ? 'Activated Filter' : 'Deactivated Filter';
				var statusText = checkboxInput.is(':checked') ? 'active' : 'inactive';
				$.jGrowl(
					$(this).parent('h3').text() + " now " + statusText,
					{header:headerText}
				);
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
				var slider = $(this).parent();
				$('.min.year', slider).text(ui.values[0]);
				$('.max.year', slider).text(ui.values[1]);
			}
		});
		
		// Interaction: Datepicker controls
		$('.date:text').datepicker();
		
		// Interaction: Autocomplete controls
		// TODO: Add data-method to specify search method
		// TODO: Clear autocomplete on select
		$(':input[name^=filter-].autocomplete').each(function() {
			$('<ul></ul>')
				.attr('id','selected-' + $(this).attr('data-method'))
				.insertAfter(this);
			$(this).autocomplete({
				source: 'search/' + $(this).attr('data-method') + '.js',
				minLength: 2,
				select: function(event, ui) {
					// check for duplicate entry first
					// if it exists, just highlight that entry
					// and start a jGrowl message
					var itemName = $(this).attr('data-method');
					var itemId = itemName + '-' + ui.item.value;
					if($('#'+itemId).length > 0) {
						$('#'+itemId).effect('highlight', {}, 2000);
						$.jGrowl(ui.item.value + ' item has already been added', {header:'Duplicate Exists'});
					} else {
						$('<li></li>')
							.append(ui.item.value + ' - ' + ui.item.label)
							.attr('id', itemId)
							.appendTo('ul#selected-' + itemName)
							.effect('highlight', {}, 2000);
					}
				},
				close: function(event, ui) {
					$(this).val('');
				}
				
			});
		});
		
		/*
		$('.multiselect').each(function() {
			$(this).multiselect({multiple:$(this).attr('multiple'), selectedText:"Hello world"});
		});
		*/
		
		$(":input[name=filter-sample-date-end]").hide();
		$("<img src='stylesheets/flick/images/datepicker.gif' />").insertAfter(":input[name^=filter-sample-date-]");
		$(':input[name=operator-sample-date]').change(function() {
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
		$("#run_report").click(function() {
			getData('get_sample_data', {rpt_yr_range:{start:1985,end:1986}, conc_gt:5, chem_in:[183]}, function(data,textStatus){
				// Anonymous Success Handler
				console.info(data);
				//$('#record-results').html();
			});
		});
		
		// DEMO: Call API to deliver data
});

function getData(methodName, argumentCollection, successHandler) {
	//var successHandler = function(data,textStatus) { alert('success'); };
	var errorHandler = function(request, textStatus, errorThrown) { alert('error'); }
	
	$.ajax({
		type:'POST',
		url:'data.cfc',
		data:{
			method:methodName,
			argumentCollection:$.toJSON(argumentCollection)
		},
		success:successHandler,
		error:errorHandler,
		dataType:'json'
	});
}

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
