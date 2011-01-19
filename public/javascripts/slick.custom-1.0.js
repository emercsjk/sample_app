/*V 1.0
 * 04.01.2010 Jan Kaiser (jan.kaiser@emercs.com)
 * 
 * Versionsüberblick:
 * 1.0 - 04.01.2010 - Es wird Zeit für die 1.0
 * 
 * 
 * Globale Variablen für das SlickGrid.
 * 
 * - rc ist der RequestController, der die Änderungen vom Grid abfragt und per Ajax verschickt
 * - dataView hält die aktuelle View, auf die Filter, Sortieren und Paging angewandt ist
 * - dataViewSum hält ebenfalls die aktuelle View, allerdings ohne das Paging für die Gesamtsummen
 * - grid hält alle Daten, aus denen bei Filter/Paging-Änderungen die DataViews neu berechnet werden
 * - data enthält die Zelleninhalte, die per Ajax geladen werden
 * - columns enhält die Spaltendefinitionen, die per Ajax geladen werden
 * - filter hält alle anzuwendenden Filter 
 * - sum hält die Gesamtsummen aller Spalten, die sum : true sind
 * 
 * 
 * Filter werden als columns-Option filter angegeben. Sie definieren min, max und optional minval, maxval als Startwerte
 *
 * - Es darf keine Spalte mit der id "id" angelegt werden, da diese intern verwendet wird.  
 */

var rc;
var dataView;
var dataViewSum = new Slick.Data.DataView();
var grid;
var pager;
var columnpicker;
var data = [];
var columns = [];

// Arrays werden mit allen Filtern und allen Gesamtsummen und Grading-Einstellungen befüllt
var filter = [];
var sum = [];
var grade = [];

// Hilfsvariable für Options-Accordion
var opts = false;

// Legt Pixelgrößen der SlickGrid-Bestandteile fest. Könnte man noch
// automatisieren, indem man auf entsprechende DOM-Objekte zugreift, ist aber
// aufwendig.

var gridHeightHeader = 27;
var gridHeightVersatz = 80;
var gridHeightCell = 25;
var accordionWidth = 300;
var actualAccordionWidth = 0;
var maxrows = 0;

// Generelle Optionen für das SlickGrid, muss aktuell nicht von Hand angefasst
// werden
var options = {
	enableColumnReorder : true,
	editable : true,
	autoEdit : true,
	enableAddRow : false,
	enableCellNavigation : true,
	showSecondaryHeaderRow : false,
	editCommandHandler : RequestHandler,
	forceFitColumns : true,
	syncColumnCellResize : true,
	autoHeight : false
};

/*
 * !!! Hier beginnt die jQuery-Interaktion !!!
 */

$(function() {

	// Größe der Seitenelemente festlegen und initialisieren
	var maxWidth = $(window).width() - 25;
	$("#myGrid").width(maxWidth - actualAccordionWidth);
	$("#pager").width(maxWidth - actualAccordionWidth);
	$("#accordion").accordion( {
		fillSpace : true,
		active : false,
		autoHeight : true,
		collapsible : true
	}).accordion("resize").hide();
	maxGridHeight();

	// Funktion zur Berechnung maximale Gridhöhe, wird auch von Window.resize
	// genutzt
	function maxGridHeight() {
		_h = $(window).height() - gridHeightVersatz - 2 * gridHeightHeader;
		maxRows = Math.round(_h / gridHeightCell) - 1;
		$("#myGrid").height(gridHeightHeader + (maxRows * gridHeightCell));
		$("#accordion").height(gridHeightHeader + (maxRows * gridHeightCell));
		$("#accordion").accordion("resize");

	}

	// Was tun bei Window-Resize?
	$(window).resize(
			function() {
				maxWidth = $(window).width() - 25;
				$("#myGrid").width(maxWidth - actualAccordionWidth);
				$("#pager").width(maxWidth - actualAccordionWidth);
				maxGridHeight();
				grid.autosizeColumns();
				if (autoPage)
					pager = new Slick.Controls.Pager(dataView, grid,
							$("#pager"));
				loader.css("position", "absolute").css("top",
						$("#myGrid").height() / 2).css("left",
						$("#myGrid").width() / 2);
			});

	// "Saving"-DIV verstecken
	$("#saving").hide();

	// Requestcontroller initialisieren
	rc = new RequestController();

	//Requestcontroller-DIV initialisieren und verstecken
	$("#rc").css( {
		"background" : "#000000",
		"color" : "#00FF00",
		"padding" : "10px",
		"margin" : "10px"
	});
	$("#rc").hide();

	// Ein paar lustige Knöpfe mit Funktion
	$("#options").button( {
		icons : {
			primary : "ui-icon-wrench"
		}
	}).click(function() {
		if (!opts) {
			actualAccordionWidth = 300;
			$("#myGrid").animate( {
				"width" : maxWidth - actualAccordionWidth
			}, function() {
				grid.autosizeColumns();
			});
			$("#pager").animate( {
				"width" : maxWidth - actualAccordionWidth
			});
			grid.autosizeColumns();
			$("#accordion").show("fade");
		}

		else {
			actualAccordionWidth = 0;
			$("#myGrid").animate( {
				"width" : maxWidth
			}, function() {
				grid.autosizeColumns();
			});
			$("#pager").animate( {
				"width" : maxWidth
			});
			grid.autosizeColumns();
			$("#accordion").hide("fade");
		}
		$("#accordion").accordion("resize");
		opts = !opts;
	});
	$("#home").button( {
		icons : {
			primary : "ui-icon-home"
		}
	});
	$("#reload").button( {
		icons : {
			primary : "ui-icon-refresh"
		}
	}).click(function() {
		loadSettings();
	});
	$("#help").button( {
		icons : {
			primary : "ui-icon-help"
		}
	});
	$("#debug").button( {
		icons : {
			primary : "ui-icon-info"
		}
	}).click(function() {
		if (!rc.debug)
			$("#rc").show("blind").html(rc.toString());
		else
			$("#rc").hide("slide");
		rc.debug = !rc.debug;
	});
	
	

	// Daten laden

	// Loader-Span basteln und positionieren
	loader = $(
			"<span class='loading-indicator'><label>Einstellungen laden...</label></span>")
			.appendTo(document.body);
	var _h = $("#myGrid").height();
	var _w = $("#myGrid").width();

	loader.css("position", "absolute").css("top", _h / 2).css("left", _w / 2);

	// Settings (Cols) laden, Callback lädt die Daten
	loadSettings();

	// Hilfsfunktionen

	// Diese Funktion wird auf jedes Item in einer zu filternden Spalte
	// aufgerufen
	function customFilter(item) {
		for (i = 0; i < filter.length; i++) {
			var f = filter[i];

			if (f.active) {

				if (f.type == "search") {

					if (!item[f.field])
						return false;

					if (item[f.field].indexOf(f.value) < 0)
						return false;

				} else if (f.type == "check") {
					if (item[f.field] == null)
						return false;

					if (item[f.field] != f.value)
						return false;

				} else if (f.type == "range") {

					if (!item[f.field])
						return false;

					//Grenzbetrachtung: Kleiner oder kleiner gleich?
					//Achtung: Durch False-Returns umgekehrte Logik!
				
					if (f.kg)
						_kg =  ">";
					else
						_kg =  ">=";
				
					if (f.gg)
						_gg =  "<";
					else
						_gg =  "<=";
					
														
					if (eval("item[f.field] " + _gg + " f.value[0]"))
						return false;

					if (eval ("item[f.field] " + _kg + " f.value[1]"))
						return false;

				} else {
					if (item[f.field] < f.minval || item[f.field] > f.maxval)
						return false;
				}
			}
		}
		return true;
	}

	function loadSettings() {
		data = [];
		columns = [];

		$("#myGrid").html("");
		loader.show();
		$.ajax( {
			url : "/cols.php",
			success : function(_cols) {
				loader.html("<label>Daten laden...</label>");
				columns = JSON.parse(_cols);

				for (i = 0; i < columns.length; i++) {

					//Da formatter/editor als Strings übergeben werden müssen, Eval drüber, passt!
					if (columns[i].formatter)
						columns[i].formatter = eval(columns[i].formatter);

					if (columns[i].editor)
						columns[i].editor = eval(columns[i].editor);
				}

				loadData();
			}
		});
	}

	//Lädt die Daten zu den entsprechenden Cols in loadSettings-Ajax-Callback-Funktion
	function loadData() {
		$.ajax( {
					url : "/loader.php",
					data : {
						"cols" : $("#loadcols").attr("value")
					},
					success : function(_data) {
						loader
								.html("<label class='loaderparse'>Parse Daten...</label>");
						try {

							data = JSON.parse(_data);

						}

						catch (e) {

							alert("JSON-Parsing abgebrochen. Fehler: " + e);

						}
						loader.hide();
						// Tabelle um interne ID-Spalte erweitern
						// zwingend erforderlich für dataView und Ajax-Requests!
						// Achtung: Überschreibt eventuelle id-Column in data
						for ( var i = 0; i < data.length; i++) {

							data[i]["id"] = i;

						}

						// Grid anlegen über dataView
						dataView = null;
						dataView = new Slick.Data.DataView();

						filterAndSums();

						dataView.beginUpdate();
						dataView.setItems(data);
						dataView.setFilter(customFilter);
						dataView.endUpdate();

						dataViewSum = new Slick.Data.DataView();

						dataViewSum.beginUpdate();
						dataViewSum.setItems(data);
						dataViewSum.setFilter(customFilter);
						dataViewSum.endUpdate();

						$("#sum").html(sumHtml());

						grid = new Slick.Grid($("#myGrid"), dataView.rows,
								columns, options);

						pager = new Slick.Controls.Pager(dataView, grid,
								$("#pager"));

						// Ich habe leider vollkommen vergessen, wieso das grid hier
						// erneut initialisiert werden muss. Ohne aber stirbt der Pager.
						grid = new Slick.Grid($("#myGrid"), dataView.rows,
								columns, options);



						columnpicker = new Slick.Controls.ColumnPicker(columns,
								grid, options);


						var sortcol;
						var sortdir;

						grid.onSort = function(sortCol, sortAsc) {
							sortcol = sortCol.field;
							sortdir = sortAsc ? 1 : -1;
							dataView.sort(compare, sortAsc);
						}

						grid.onCellChange = function() {
							dataView.sort(compare, sortdir);
							dataViewSum.sort(compare, sortdir);
							$("#sum").html(sumHtml());
						}

						function compare(a, b) {
							// if (sortcol=="costs") zum Abfangen, welche Spalte
							// sortiert wird, falls wir spezielle Sortierer
							// benötigen

							var x = a[sortcol], y = b[sortcol];

							return (x == y ? 0 : (x > y ? 1 : -1));
						}

						
						//Listener etc belegen
						dataView.onRowCountChanged.subscribe(function(args) {
							self.grid.updateRowCount();
							self.grid.render();
						});

						dataView.onRowsChanged.subscribe(function(rows) {
							self.grid.removeRows(rows);
							self.grid.render();
						});

						dataViewSum.onRowCountChanged.subscribe(function(args) {

						});

						dataViewSum.onRowsChanged.subscribe(function(rows) {

						});

						$("#sum").html(sumHtml());

					}
				});
	}

	function goodbye(e) {
		if (!rc.idle()) {
			if(!e) e = window.event;
			//e.cancelBubble is supported by IE - this will kill the bubbling process.
			e.cancelBubble = true;
	 
			//e.stopPropagation works in Firefox.
			if (e.stopPropagation) e.stopPropagation();
			
			//Google Chrome?
			if (e.preventDefault) e.preventDefault();
			
			
			return "Speichervorgang noch nicht abgeschlossen. Beim Verlassen der Seite gehen nicht gespeicherte Änderungen verloren.";
		}
	}

	window.onbeforeunload=goodbye;


	
});

// !!! Hier endet die jQuery-Interaktion !!!

// FILTER & GESAMTSUMMEN INITIALISIEREN
function filterAndSums() {
	$("#filter").html("");
	filter = [];
	sum = [];
	grade = [];

	fi = 0;
	for (i = 0; i < columns.length; i++) {

		// Filter initialisieren, siehe slick.filter.js
		f = columns[i].filter;
		if (f) {
			initFilter(f, fi, columns[i].id, columns[i].name);
			fi++;
		}

		// Spalte ist sum:true? Dann Spalte auf den sum-Stapel packen
		if (columns[i].sum)
			sum.push( {
				name : columns[i].name,
				field : columns[i].field,
				rel : columns[i].rel,
				format : columns[i].formatter,
				val : 0
			});
	}
}

// Hilfsfunktion gibt HTML aller Gesamtsumme-Spalten zur�ck
function sumHtml() {
	str = "";
	calcSum();
	for (ii = 0; ii < sum.length; ii++) {
		str += "<b>" + sum[ii].name + ":</b> "; 
		
		_s = Math.round(sum[ii].val*100)/100; 
		if (sum[ii].format)
			_s = sum[ii].format(_s, _s, _s);
		
		
		str += _s + "<br>";
	}
	
	str += "<hr>Hinweis: Alle Werte sind auf zwei Nachkommastellen gerundet.";
	return str;
}

// Hilfsfunktion berechnet alle Gesamtsummen und speichert sie in sum
function calcSum() {
	dataViewSum.refresh();
	for (i = 0; i < sum.length; i++) {
		_sum = 0;
		for (j = 0; j < dataViewSum.rows.length; j++) {
			_sum += parseFloat(dataViewSum.rows[j][sum[i].field]);
		}
		if (sum[i].rel)
			sum[i].val = _sum / dataViewSum.rows.length;
		else
			sum[i].val = _sum;
	}
}

// Funktion fängt Editieren einer Zelle ab.
function RequestHandler(item, col, editCommand) {
	// Führt das Editier-Kommando im Frontend aus
	editCommand.execute();

	// Führt das Editier-Kommando im Backend aus
	// Aktuell nur Dummy-Werte, muss mit echtem Webservice noch verknüpft werden
	updateData = {
		table : "ShopTabelle",
		column : col.id,
		newValue : editCommand.serializedValue,
		oldValue : editCommand.prevSerializedValue,
		where : item.id
	},

	//action = "UPDATE" und data = updateData
	rc.sendRequest("UPDATE", updateData);

	if (rc.debug)
		$("#rc").html(rc.toString());
}

// jQuery-Datepicker auf Deutsch umstellen

jQuery(function($) {
	$.datepicker.regional['de'] = {
		clearText : 'l&ouml;schen',
		clearStatus : 'aktuelles Datum l&ouml;schen',
		closeText : 'schlie&szlig;en',
		closeStatus : 'ohne &Auml;nderungen schlie&szlig;en',
		prevText : '&#x3c;zur&uuml;ck',
		prevStatus : 'letzten Monat zeigen',
		nextText : 'Vor&#x3e;',
		nextStatus : 'n&auml;chsten Monat zeigen',
		currentText : 'heute',
		currentStatus : '',
		monthNames : [ 'Januar', 'Februar', 'M&auml;rz', 'April', 'Mai',
				'Juni', 'Juli', 'August', 'September', 'Oktober', 'November',
				'Dezember' ],
		monthNamesShort : [ 'Jan', 'Feb', 'M&auml;r', 'Apr', 'Mai', 'Jun',
				'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ],
		monthStatus : 'anderen Monat anzeigen',
		yearStatus : 'anderes Jahr anzeigen',
		weekHeader : 'Wo',
		weekStatus : 'Woche des Monats',
		dayNames : [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag',
				'Freitag', 'Samstag' ],
		dayNamesShort : [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ],
		dayNamesMin : [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ],
		dayStatus : 'Setze DD als ersten Wochentag',
		dateStatus : 'W&auml;hle D, M d',
		dateFormat : 'dd.mm.yy',
		firstDay : 1,
		initStatus : 'W&auml;hle ein Datum',
		isRTL : false
	};
	$.datepicker.setDefaults($.datepicker.regional['de']);
});