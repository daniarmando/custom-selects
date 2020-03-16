var CustomComponent = CustomComponent || {};

CustomComponent.SelectPicker = (function() {
	
	function SelectPicker() {}	
	
	SelectPicker.prototype.toApply = function() {
        	$.each($('.custom-selectpicker'), function() {
        		transformInSelectPicker(this);
        	});				
	}	
	
	function transformInSelectPicker(select) {
		$(select).addClass('selectpicker').attr('multiple', '').val('');		
		applySettings();				
	}		
	
	function applySettings() {
	var config = $.fn.selectpicker.Constructor.DEFAULTS;
	
	config.style = "";
        config.noneSelectedText = "No items selected";        
        config.noneResultsText = "No results found for {0}";
        config.countSelectedText = function(e,t){return 1==e?"{0} selected item":"{0} selected items"},
        config.maxOptionsText = function(e,t){return[1==e?"Limit reached ({n} item max)":"Limit reached ({n} items max)",1==t?"Group limit reached ({n} item max)":"Group limit reached ({n} items max)"]},
        config.selectAllText ="Select All",
        config.deselectAllText = "Deselect All",        
        config.doneButtonText = "Close",    
        config.width = "100%";
        config.liveSearch = true;
        config.actionsBox = true;
        config.selectedTextFormat = "count > 4";
        
        var screenHeight = screen.height;
        if (screenHeight >= 1080) {
        	config.size = 17;
        } else if(screenHeight >= 1024 && screenHeight < 1080) {
        	config.size = 15;
        } else if (screenHeight >= 900 && screenHeight < 1024) {
        	config.size = 12;
        } else if (screenHeight >= 720 && screenHeight < 900) {
        	config.size = 6;
        } else if (screenHeight >= 600 && screenHeight < 720) {
        	config.size = 2;
        } else {
        	config.size = 'auto';
        }
        
	}
	
	return SelectPicker;
	
}());

$(function() {
	var SelectPicker = new CustomComponent.SelectPicker();
	SelectPicker.toApply();			
});
