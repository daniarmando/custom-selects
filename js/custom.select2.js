var CustomComponent = CustomComponent || {};

CustomComponent.Select2 = (function() {
	
	function Select2() {}	
	
	Select2.prototype.toApply = function() {
		$.each($('.custom-select2'), function() {
			transformInSelect2(this);
		});				
	}	
	
	return Select2;
	
}());

$(function() {
	var select2 = new CustomComponent.Select2();
	select2.toApply();
});


function transformInSelect2(select, idSelect, idDivContainer) {		
	if(select || (idSelect && idDivContainer)) {
		var select = idSelect ? $(idSelect) : new jQuery(select);
		var container = idSelect ? $(idDivContainer) : select.parent();	    
		var theme = "bootstrap";
		var width = "resolve";
		var language = "pt-BR";		
		var matcher = function(argument, selectOptionText) {
			if ($.trim(argument.term) === '') {
				return selectOptionText;
			}
			if (typeof selectOptionText === 'undefined') {
				return null;
			}
			var args = argument.term.toString();
			var texto = selectOptionText.text.toString().toLowerCase();
			var non_asciis = {'a': '[àáâãäå]', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'u': '[ùúûűü]'};
			for (i in non_asciis) { texto = texto.toLowerCase().replace(new RegExp(non_asciis[i], 'g'), i); }
			
			var terms = (args + "").split(" ");
			var strRegex = "";
			for (var i=0; i < terms.length; i++){
				if (terms[i] != "") { 
					var strRegex = strRegex + "(?=.*" + terms[i] + ")";
				}
			}
			var tester = new RegExp(strRegex, "i");
			if (tester.test(texto) || tester.test(selectOptionText.text) ){
				var modifiedData = $.extend({}, selectOptionText, true);
				return modifiedData;
			} else {
				return null;
			}
		};	    	    
			
		select.select2({
			matcher: matcher,
			theme: theme,
			width: width,
			language: language
		});
		container.on('keyup', function(event) {
			if (event.key == "Escape") {
				select.val('0');
				select.trigger('change');
			}	        	       
		});  		
	}		
}