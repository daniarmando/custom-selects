var CustomSelect = CustomSelect || {};

CustomSelect.SelectState = (function() {
	
	function SelectState() {		
		this.select = $('.js-custom-selectpicker--state');				
		this.emitter = $({});
		this.on = this.emitter.on.bind(this.emitter);
		this.inputHiddenStateSelected = $('#inputHiddenSelectedState');
	}
				
	SelectState.prototype.start = function() {	
		this.select.on('change', onChangedState.bind(this));
		this.select.on('changed.bs.select', onSelectedState.bind(this));		
		initializeStates.call(this);
	}
	
	function initializeStates() {		
		$.ajax({
				headers: { "Accept": "application/json"},					
				method: 'GET',										
				url: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados',								
				crossDomain: true,				
			})
			.done(onEndFindStates.bind(this))
			.fail(function() {
				alert('Error fetching states')
			});
	}

	function onEndFindStates(states) {
		var options = [];
		var orderedStates = states.sort(function(a, b) {
			return a.nome.localeCompare(b.nome);
		});	

		orderedStates.forEach(function(estado) {
			options.push('<option value="' + estado.id + '">' + estado.nome + '</option>');
		});

		this.select.html(options.join(''));			
		this.select.selectpicker('render');			

		var selectedStatesIds = this.inputHiddenStateSelected.val();
		if (selectedStatesIds) {
			var idStates = selectedStatesIds.split(',');
			this.select.selectpicker('val', idStates);
			this.select.selectpicker('render');			
		}  else {
			this.select.selectpicker('refresh');	
			this.select.selectpicker('selectAll');			
		}													
	}
	
	function onChangedState() {						
		if (this.select) {					
			this.select.removeAttr('disabled');			
			this.select.parent().removeClass('disabled');
			this.select.parent().children().removeClass('disabled');	
														
			this.select.selectpicker('refresh');															
		} else {
			reset.call(this);
		}					
	}	
	
	function onSelectedState(e, clickedIndex, isSelected, previousValue) {
		var selectedStatesIds = this.select.val() ? this.select.val().toString() : '';
		this.inputHiddenStateSelected.val(selectedStatesIds);		
		this.emitter.trigger('selected', selectedStatesIds);		
	}
	
	function reset() {		
		this.select.html('');				
		this.select.attr('disabled', 'disabled');				
		this.select.parent().addClass('disabled');
		this.select.parent().children().addClass('disabled');
				
		this.select.selectpicker('refresh');
		
		this.inputHiddenStateSelected.val('');
	}
			
	return SelectState;
	
}());

CustomSelect.SelectCity = (function() {
	
	function SelectCity(SelectState) {
		this.SelectState = SelectState;
		this.select = $(".js-custom-selectpicker--city");		
		this.spinner = $('.spinner');		
		this.inputHiddenSelectedCity = $('#inputHiddenSelectedCity');		
	}
	
	SelectCity.prototype.start = function() {		
		reset.call(this);	
		this.select.on('changed.bs.select', onSelectedCity.bind(this));
		this.SelectState.on('selected', onSelectedState.bind(this));		
		var selectedStatesIds = this.SelectState.select.val();		
		initializeCities.call(this, selectedStatesIds);		
	}	
	
	function onSelectedCity() {
		updateCity.call(this);
	}
	
	function updateCity() {
		var selectedCitiesId = this.select.val() ? this.select.val().toString() : '';
		this.inputHiddenSelectedCity.val(selectedCitiesId);
	}
	
	function onSelectedState(event, selectedStatesIds) {			
		this.inputHiddenSelectedCity.val('');
		initializeCities.call(this, selectedStatesIds);		
	}
	
	function initializeCities(selectedStatesIds) {		
		if (selectedStatesIds.toString().length > 0) {		
			var resposta = $.ajax({
				headers: { "Accept": "application/json"},									
				method: 'GET',								
				url: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + selectedStatesIds.toString().replace(/,/g, '|') + '/municipios',				
				crossDomain: true,				
				beforeSend: startRequest.bind(this),
				complete: finishRequest.bind(this)
			});			
			resposta.done(onEndFindCities.bind(this));
		} else {			
			reset.call(this);
		}
	}
	
	function onEndFindCities(cities) {
		var options = [];
		var satateName = '';		
		if(cities.length > 0) {
			var orderedCities = cities.sort(function(a, b) {
				return a.microrregiao.mesorregiao.UF.nome.localeCompare(b.microrregiao.mesorregiao.UF.nome);
			});

			orderedCities.forEach(function(city){		
				if (satateName != city.microrregiao.mesorregiao.UF.nome) {
					if (satateName != '') options.push('</optgroup>');
					options.push('<optgroup label="' + city.microrregiao.mesorregiao.UF.nome + '">');			
				}						
				options.push('<option value="' + city.id + '">' + city.nome + '</option>');
				satateName = city.microrregiao.mesorregiao.UF.nome;												
			});				
			options.push('</optgroup>');
								
			this.select.html(options.join(''));	
			this.select.removeAttr('disabled');			
			this.select.parent().removeClass('disabled');
			this.select.parent().children().removeClass('disabled');		
			
			var selectedCitiesId = this.inputHiddenSelectedCity.val();
			if (selectedCitiesId) {
				var idCities = selectedCitiesId.split(',');							
				this.select.selectpicker('val', idCities);
				this.select.selectpicker('render');				
			}
		} else {			
			reset.call(this);			
		} 			
	}
	
	function reset() {		
		this.select.html('');				
		this.select.attr('disabled', 'disabled');				
		this.select.parent().children().addClass('disabled');	
		this.spinner.parent().removeClass('disabled');
				
		this.select.selectpicker('refresh');			
	}
	
	function startRequest() {
		reset.call(this);
		this.select.parent().css({'width':'90%', 'transition':'width .3s'});
		this.spinner.show();
	}
	
	function finishRequest() {		
		this.spinner.hide();				
		this.select.selectpicker('refresh');			
		if (!this.inputHiddenSelectedCity.val()) {
			this.select.selectpicker('selectAll');
			updateCity.call(this);
		}		
	}
	
	return SelectCity;
	
}());

$(function() {	
	var SelectState = new CustomSelect.SelectState();
	SelectState.start();
	
	var SelectCity = new CustomSelect.SelectCity(SelectState);
	SelectCity.start();		
});