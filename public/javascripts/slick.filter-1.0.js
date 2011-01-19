/*V 1.0
 * 04.01.2010 Jan Kaiser (jan.kaiser@emercs.com)
 * 
 * Ausgelagerte Filter-Initialisierung. Baut sowohl die HTML-Objekte als
 * auch die Filter-Funktionalitäten im filter-Array 
 */

//Filter je nach Type initialisieren
function initFilter(_filter, pos, cid, name) {

	var _max = _filter.max;
	var _min = _filter.min;
	// Max/Minimalwerte des Filters feststellen

	if (_min == null)
		_min = arrayMin(data, cid);

	if (_max == null)
		_max = arrayMax(data, cid);

	// Standardwerte für alle Filtertypen:
	var customVal = [];
	customVal["search"] = "";
	customVal["check"] = true;
	customVal["range"] = [ _min, _max ];
	if (_filter.value == null)
		_filter.value = customVal[_filter.type];

	// Filter auf das filter-Array legen
	// kg, gg sind Bools für "kleiner/größer gleich" für die Range-Filter
	filter.push( {
		type : _filter.type,
		active : false,
		field : cid,
		value : _filter.value,
		min : _min,
		max : _max,
		kg : true,
		gg : true
	});

	_headerHide = {
		"margin-top" : 5,
		"padding" : 3,
		"background" : "#A1C75F",
		"opacity" : 0.5,
		"color" : "#000000",
		"cursor" : "pointer"

	};
	_headerShow = {
		"opacity" : 1,
		"color" : "#FFFFFF"
	};

	_filterShow = {
		"padding" : 3,
		"border-left-width" : 1,
		"border-right-width" : 1,
		"border-bottom-width" : 1,
		"border-color" : "#A1C75F",
		"border-style" : "solid"

	};

	$("#filter").append("<div class='fh" + pos + "'>" + name + "</div>");
	$("#filter")
			.append("<div class='fc" + pos + "'>" + _filter.type + "</div>");
	$(".fc" + pos).css(_filterShow).hide();
	$(".fh" + pos).css(_headerHide).attr("filter", pos).click(function() {
		if (!filter[pos].active) {
			$(this).animate(_headerShow);
			drawFilter(pos);
			$(".fc" + pos).show("blind");
			$(".hf" + cid).show();
			$("#" + grid.uid() + cid).addClass('cell-filter');
		} else {
			$(this).animate(_headerHide);
			$(".fc" + pos).hide("blind");
			$(".hf" + cid).hide();
			$("#" + grid.uid() + cid).removeClass('cell-filter');
		}
		filter[pos].active = !filter[pos].active;
		dataView.refresh();
		$("#sum").html(sumHtml());

	});

}

function drawFilter(_pos) {
	fString = "";

	// TEXTSUCHE
	if (filter[_pos].type == "search") {
		fString += "<b>Suche:</b> <input class='sl" + _pos
				+ "' type=text style='width:98%;'>";
		$(".fc" + _pos).html(fString);
		$(".sl" + _pos).val(filter[_pos].value);
		$(".sl" + _pos).attr("filter", _pos).change(function() {

			filter[$(this).attr("filter")].value = $(this).val();
			dataView.refresh();
			$("#sum").html(sumHtml());

		});

	}

	// FILTER MIT BOOLEAN CHECKBOX
	else if (filter[_pos].type == "check") {

		var fString = "<img src='";

		if (filter[_pos].value)
			fString += "/images/tick.png";
		else
			fString += "/images/notick.png";
		fString += "' class='check" + _pos + "'>";

		$(".fc" + _pos).css( {
			"text-align" : "center",
			"cursor" : "pointer"
		}).html(fString).attr("filter", _pos).click(
				function() {

					filter[$(this).attr("filter")].value = !filter[$(this)
							.attr("filter")].value;

					var fString = "<img src='";

					if (filter[$(this).attr("filter")].value)
						fString += "/images/tick.png";
					else
						fString += "/images/notick.png";
					fString += "' class='check" + _pos + "'>";

					$(this).html(fString);

					dataView.refresh();
					$("#sum").html(sumHtml());

				});
	}

	// FILTER MIT SLIDER VON ... BIS
	
	else if (filter[_pos].type == "range") {
				
		// Min/Max festlegen bzw aus Daten berechnen

		fString += "<table style='width:100%;'>"
				+ "<tr><td style='text-align:center;'>" + "<div class='g"
				+ _pos
				+ "'></div>"
				+ "</td><td></td><td style='text-align:center;'>"
				+ "<div class='k"
				+ _pos
				+ "'></div></td></tr>"
				+ "<tr><td><input class='min"
				+ _pos
				+ "' type=text style='width:40px;' value ='"
				+ filter[_pos].value[0]
				+ "'></td><td style='width:100%;'><div class='sl"
				+ _pos
				+ "' style='margin:5px; '></div>"
				+ "</td><td>"
				+ "<input class='max"
				+ _pos
				+ "' type=text style='width:40px;' value ='"
				+ filter[_pos].value[1]
				+ "'</td></td></tr><tr>"
				+ "<td>("
				+ filter[_pos].min
				+ ")</td><td></td>"
				+ "<td>("
				+ filter[_pos].max + ")</td>" + "</tr></table>";
		$(".fc" + _pos).html(fString);

		if (filter[_pos].gg)
			$(".g" + _pos).html("<img src=/images/filter_gg.png>")
		else
			$(".g" + _pos).html("<img src=/images/filter_g.png>")
		
			
		if (filter[_pos].kg)
			$(".k" + _pos).html("<img src=/images/filter_kg.png>")
		else
			$(".k" + _pos).html("<img src=/images/filter_k.png>")
		
		//Klickfunktion Kleiner/Größergleich-Piktogramme
		$(".g" + _pos).attr("filter", _pos).click(
				function() {
					filter[$(this).attr("filter")].gg = !filter[$(this).attr(
							"filter")].gg;
					if (filter[$(this).attr("filter")].gg)
						$(this).html("<img src=/images/filter_gg.png>");
					else
						$(this).html("<img src=/images/filter_g.png>");
					
					dataView.refresh();
					$("#sum").html(sumHtml());
				});
		$(".k" + _pos).attr("filter", _pos).click(
				function() {
					filter[$(this).attr("filter")].kg = !filter[$(this).attr(
							"filter")].kg;
					if (filter[$(this).attr("filter")].kg)
						$(this).html("<img src=/images/filter_kg.png>");
					else
						$(this).html("<img src=/images/filter_k.png>");
					
					dataView.refresh();
					$("#sum").html(sumHtml());
				});

		// Min-Wert Input-Feld
		$(".min" + _pos).attr("filter", _pos);
		$(".min" + _pos).change(function() {

			var _val = parseFloat($(this).val());

			// Eingegebener Wert größer als aktueller Bis-Wert?
			if (_val > filter[$(this).attr("filter")].value[1])
				_val = filter[$(this).attr("filter")].value[1];

			// Eingegebener Wert kleiner als Minimal-Wert?
			if (_val < filter[$(this).attr("filter")].min)
				_val = filter[$(this).attr("filter")].min;

			// Neuen Wert setzen
			filter[$(this).attr("filter")].value[0] = _val;

			// Input-Feld setzen
			$(this).val(_val);

			// Slider setzen
			$(".sl" + $(this).attr("filter")).slider("values", 0, _val);

			// dataView und Gesamtsummen aktualisieren
			dataView.refresh();
			$("#sum").html(sumHtml());
		});

		// Max-Wert Input-Feld
		$(".max" + _pos).attr("filter", _pos);
		$(".max" + _pos).change(function() {

			var _val = parseFloat($(this).val());

			// Eingegebener Wert kleiner als aktueller Von-Wert?
			if (_val < filter[$(this).attr("filter")].value[0])
				_val = filter[$(this).attr("filter")].value[0];

			// Eingegebener Wert größer als Maximal-Wert?
			if (_val > filter[$(this).attr("filter")].max)
				_val = filter[$(this).attr("filter")].max;

			// Neuen Wert setzen
			filter[$(this).attr("filter")].value[1] = _val;

			// Input-Feld setzen
			$(this).val(_val);

			// Slider setzen
			$(".sl" + $(this).attr("filter")).slider("values", 1, _val);

			// dataView und Gesamtsummen aktualisieren
			dataView.refresh();
			$("#sum").html(sumHtml());
		});

		// Slider
		$(".sl" + _pos).attr("filter", _pos).slider( {
			"range" : true,
			"min" : (filter[_pos].min),
			"max" : (filter[_pos].max),
			"animate" : true,
			"values" : filter[_pos].value,
			"slide" : function(event, ui) {

				// Wert geändert? Neu berechnen über window.clearTimeout;
				// Min/Max-Felder ändern
				$(".max" + $(this).attr("filter")).val(ui.values[1]);
				$(".min" + $(this).attr("filter")).val(ui.values[0]);

				if (filter[$(this).attr("filter")].value[1] != ui.values[1])
					filter[$(this).attr("filter")].value[1] = ui.values[1];

				if (filter[$(this).attr("filter")].value[0] != ui.values[0])
					filter[$(this).attr("filter")].value[0] = ui.values[0];

				dataView.refresh();
				$("#sum").html(sumHtml());
			}
		});

	}

	// FILTER MIT EQUALS-SLIDER
	else if (filter[_pos].type == "equals") {

	}

}

// HILFSFUNKTIONEN
function arrayMax(_array, _row) {
	var max = _array[0][_row];
	var len = _array.length;
	for ( var i = 1; i < len; i++)
		if (_array[i][_row] > max)
			max = _array[i][_row];
	return Math.ceil(max);
};

function arrayMin(_array, _row) {
	var min = _array[0][_row];
	var len = _array.length;
	for ( var i = 1; i < len; i++)
		if (_array[i][_row] < min)
			min = _array[i][_row];
	return Math.floor(min);
}