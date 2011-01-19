(function($) {

	var SlickEditor = {

		/* Eigene Formatter und Editors */

		// Produktbewertungsfaktor: Testweise implementiert in Abhängigkeit von
		// Spalte perc
		PbfCellFormatter : function(row, cell, value, columnDef, dataContext) {
			_test = (dataContext["perc"] > 50);
			dataContext[columnDef.id] = _test;

			// Wert in DataView ebenfalls ändern

			return (_test) ? "<img src='images/tick.png'>" : "";
		},

		StateCellEditor : function(args) {
			var $input;
			var defaultValue;
			var scope = this;

			this.init = function() {
				$input = $(
						"<button style='border: 1px dotted rgb(204, 0, 0);'>D</button> "
								+ "<button style='border: 1px dotted rgb(204, 204, 204);'>N</button> "
								+ "<button style='border: 2px solid rgb(0, 128, 0);'>A</button> ")
						.appendTo(args.container)
						.bind(
								"keydown.nav",
								function(e) {
									if (e.keyCode === $.ui.keyCode.LEFT
											|| e.keyCode === $.ui.keyCode.RIGHT) {
										e.stopImmediatePropagation();
									}
								}).focus().select();
			};

			this.destroy = function() {
				$input.remove();
			};

			this.focus = function() {
				$input.focus();
			};

			this.loadValue = function(item) {
				defaultValue = item[args.column.field] || "";
				$input.val(defaultValue);
				$input[0].defaultValue = defaultValue;
				$input.select();
			};

			this.serializeValue = function() {
				return $input.val();
			};

			this.applyValue = function(item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function() {
				return (!($input.val() == "" && defaultValue == null))
						&& ($input.val() != defaultValue);
			};

			this.validate = function() {
				if (args.column.validator) {
					var validationResults = args.column.validator($input.val());
					if (!validationResults.valid)
						return validationResults;
				}

				return {
					valid : true,
					msg : null
				};
			};

			this.init();
		},

		StateCellFormatter : function(row, cell, value, columnDef, dataContext) {
			var d = dataContext.id;
			var str = "<button style='border: 1px dotted rgb(204, 0, 0);'>D</button> "
					+ "<button style='border: 1px dotted rgb(204, 204, 204);'>N</button> "
					+ "<button style='border: 2px solid rgb(0, 128, 0);'>A</button> ";
			return str;
		},

		GraphCellFormatter : function(row, cell, value, columnDef, dataContext) {
			var d = dataContext.id;
			var url = "'gralala.html'";
			var name = "Graph";
			var options = "width=300, height=400, left=100, top=200";
			var str = "<button style='border: 1px solid rgb(0, 0, 0);' "
					+ "onclick='graph(" + dataContext.id + ")'>G</button>";
			return str;
		},

		EuroCellFormatter : function(row, cell, value, columnDef, dataContext) {
			if (value == null || value === "")
				return "-";
			else 
				return trennzeichen(value) + " &euro;";
		},

		PercCellFormatter : function(row, cell, value, columnDef, dataContext) {
			if (value == null || value === "")
				return "-";
			else
				return parseFloat(value).toFixed(2).replace(/\./, ",") + " %";
		},

		/* THESE FORMATTERS & EDITORS ARE JUST SAMPLES! */
		SelectorCellFormatter : function(row, cell, value, columnDef,
				dataContext) {
			return (!dataContext ? "" : row);
		},

		PercentCompleteCellFormatter : function(row, cell, value, columnDef,
				dataContext) {
			if (value == null || value === "")
				return "-";
			else if (value < 50)
				return "<span style='color:red;font-weight:bold;'>" + value
						+ "%</span>";
			else
				return "<span style='color:green'>" + value + "%</span>";
		},

		GraphicalPercentCompleteCellFormatter : function(row, cell, value,
				columnDef, dataContext) {
			if (value == null || value === "")
				return "";

			var color;

			if (value < 30)
				color = "red";
			else if (value < 70)
				color = "silver";
			else
				color = "green";

			return "<span class='percent-complete-bar' style='background:"
					+ color + ";width:" + value + "%'></span>";
		},

		YesNoCellFormatter : function(row, cell, value, columnDef, dataContext) {
			return value ? "Yes" : "No";
		},

		BoolCellFormatter : function(row, cell, value, columnDef, dataContext) {
			return value ? "<img src='images/tick.png'>"
					: "<img src='images/notick.png'>";
		},

		TaskNameFormatter : function(row, cell, value, columnDef, dataContext) {
			// todo: html encode
			var spacer = "<span style='display:inline-block;height:1px;width:"
					+ (2 + 15 * dataContext["indent"]) + "px'></span>";
			return spacer + " <img src='images/expand.gif'>&nbsp;" + value;
		},

		ResourcesFormatter : function(row, cell, value, columnDef, dataContext) {
			var resources = dataContext["resources"];

			if (!resources || resources.length == 0)
				return "";

			if (columnDef.width < 50)
				return (resources.length > 1 ? "<center><img src='images/user_identity_plus.gif' "
						: "<center><img src='images/user_identity.gif' ")
						+ " title='" + resources.join(", ") + "'></center>";
			else
				return resources.join(", ");
		},

		StarFormatter : function(row, cell, value, columnDef, dataContext) {
			return (value) ? "<img src='images/bullet_star.png' align='absmiddle'>"
					: "";
		},

		TextCellEditor : function(args) {
			var $input;
			var defaultValue;
			var scope = this;

			this.init = function() {
				$input = $("<INPUT type=text class='editor-text' />").appendTo(
						args.container).bind(
						"keydown.nav",
						function(e) {
							if (e.keyCode === $.ui.keyCode.LEFT
									|| e.keyCode === $.ui.keyCode.RIGHT) {
								e.stopImmediatePropagation();
							}
						}).focus().select();
			};

			this.destroy = function() {
				$input.remove();
			};

			this.focus = function() {
				$input.focus();
			};

			this.loadValue = function(item) {
				defaultValue = item[args.column.field] || "";
				$input.val(defaultValue);
				$input[0].defaultValue = defaultValue;
				$input.select();
			};

			this.serializeValue = function() {
				return $input.val();
			};

			this.applyValue = function(item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function() {
				return (!($input.val() == "" && defaultValue == null))
						&& ($input.val() != defaultValue);
			};

			this.validate = function() {
				if (args.column.validator) {
					var validationResults = args.column.validator($input.val());
					if (!validationResults.valid)
						return validationResults;
				}

				return {
					valid : true,
					msg : null
				};
			};

			this.init();
		},

		IntegerCellEditor : function(args) {
			var $input;
			var defaultValue;
			var scope = this;

			this.init = function() {
				$input = $("<INPUT type=text class='editor-text' />");

				$input.bind("keydown.nav", function(e) {
					if (e.keyCode === $.ui.keyCode.LEFT
							|| e.keyCode === $.ui.keyCode.RIGHT) {
						e.stopImmediatePropagation();
					}
				});

				$input.appendTo(args.container);
				$input.focus().select();
			};

			this.destroy = function() {
				$input.remove();
			};

			this.focus = function() {
				$input.focus();
			};

			this.loadValue = function(item) {
				defaultValue = item[args.column.field];
				$input.val(defaultValue);
				$input[0].defaultValue = defaultValue;
				$input.select();
			};

			this.serializeValue = function() {
				return parseInt($input.val(), 10) || 0;
			};

			this.applyValue = function(item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function() {
				return (!($input.val() == "" && defaultValue == null))
						&& ($input.val() != defaultValue);
			};

			this.validate = function() {
				if (isNaN($input.val()))
					return {
						valid : false,
						msg : "Please enter a valid integer"
					};

				return {
					valid : true,
					msg : null
				};
			};

			this.init();
		},

		DateCellEditor : function(args) {
			var $input;
			var defaultValue;
			var scope = this;
			var calendarOpen = false;

			this.init = function() {
				$input = $("<INPUT type=text class='editor-text' />");
				$input.appendTo(args.container);
				$input.focus().select();
				$input.datepicker( {
					showOn : "button",
					buttonImageOnly : true,
					buttonImage : "images/calendar.gif",
					beforeShow : function() {
						calendarOpen = true;
					},
					onClose : function() {
						calendarOpen = false;
					}
				});
				$input.width($input.width() - 18);
			};

			this.destroy = function() {
				$.datepicker.dpDiv.stop(true, true);
				$input.datepicker("hide");
				$input.datepicker("destroy");
				$input.remove();
			};

			this.show = function() {
				if (calendarOpen) {
					$.datepicker.dpDiv.stop(true, true).show();
				}
			};

			this.hide = function() {
				if (calendarOpen) {
					$.datepicker.dpDiv.stop(true, true).hide();
				}
			};

			this.position = function(position) {
				if (!calendarOpen)
					return;
				$.datepicker.dpDiv.css("top", position.top + 30).css("left",
						position.left);
			};

			this.focus = function() {
				$input.focus();
			};

			this.loadValue = function(item) {
				defaultValue = item[args.column.field];
				$input.val(defaultValue);
				$input[0].defaultValue = defaultValue;
				$input.select();
			};

			this.serializeValue = function() {
				return $input.val();
			};

			this.applyValue = function(item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function() {
				return (!($input.val() == "" && defaultValue == null))
						&& ($input.val() != defaultValue);
			};

			this.validate = function() {
				return {
					valid : true,
					msg : null
				};
			};

			this.init();
		},

		YesNoSelectCellEditor : function(args) {
			var $select;
			var defaultValue;
			var scope = this;

			this.init = function() {
				$select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='yes'>Yes</OPTION><OPTION value='no'>No</OPTION></SELECT>");
				$select.appendTo(args.container);
				$select.focus();
			};

			this.destroy = function() {
				$select.remove();
			};

			this.focus = function() {
				$select.focus();
			};

			this.loadValue = function(item) {
				$input.val((defaultValue = item[args.column.field]) ? "yes"
						: "no");
				$input.select();
			};

			this.serializeValue = function() {
				return ($input.val() == "yes");
			};

			this.applyValue = function(item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function() {
				return ($select.val() != defaultValue);
			};

			this.validate = function() {
				return {
					valid : true,
					msg : null
				};
			};

			this.init();
		},

		YesNoCheckboxCellEditor : function(args) {
			var $select;
			var defaultValue;
			var scope = this;

			this.init = function() {
				$select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
				$select.appendTo(args.container);
				$select.focus();
			};

			this.destroy = function() {
				$select.remove();
			};

			this.focus = function() {
				$select.focus();
			};

			this.loadValue = function(item) {
				defaultValue = item[args.column.field];
				if (defaultValue)
					$select.attr("checked", "checked");
				else
					$select.removeAttr("checked");
			};

			this.serializeValue = function() {
				return $select.attr("checked");
			};

			this.applyValue = function(item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function() {
				return ($select.attr("checked") != defaultValue);
			};

			this.validate = function() {
				return {
					valid : true,
					msg : null
				};
			};

			this.init();
		},

		PercentCompleteCellEditor : function(args) {
			var $input, $picker;
			var defaultValue;
			var scope = this;

			this.init = function() {
				$input = $("<INPUT type=text class='editor-percentcomplete' />");
				$input.width($(args.container).innerWidth() - 25);
				$input.appendTo(args.container);

				$picker = $("<div class='editor-percentcomplete-picker' />")
						.appendTo(args.container);
				$picker
						.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

				$picker
						.find(".editor-percentcomplete-buttons")
						.append(
								"<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

				$input.focus().select();

				$picker.find(".editor-percentcomplete-slider").slider( {
					orientation : "vertical",
					range : "min",
					value : defaultValue,
					slide : function(event, ui) {
						$input.val(ui.value);
					}
				});

				$picker.find(".editor-percentcomplete-buttons button").bind(
						"click",
						function(e) {
							$input.val($(this).attr("val"));
							$picker.find(".editor-percentcomplete-slider")
									.slider("value", $(this).attr("val"));
						});
			};

			this.destroy = function() {
				$input.remove();
				$picker.remove();
			};

			this.focus = function() {
				$input.focus();
			};

			this.loadValue = function(item) {
				$input.val(defaultValue = item[args.column.field]);
				$input.select();
			};

			this.serializeValue = function() {
				return parseInt($input.val(), 10) || 0;
			};

			this.applyValue = function(item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function() {
				return (!($input.val() == "" && defaultValue == null))
						&& ((parseInt($input.val(), 10) || 0) != defaultValue);
			};

			this.validate = function() {
				if (isNaN(parseInt($input.val(), 10)))
					return {
						valid : false,
						msg : "Please enter a valid positive number"
					};

				return {
					valid : true,
					msg : null
				};
			};

			this.init();
		},

		StarCellEditor : function(args) {
			var $input;
			var defaultValue;
			var scope = this;

			function toggle(e) {
				if (e.type == "keydown" && e.which != 32)
					return;

				if ($input.css("opacity") == "1")
					$input.css("opacity", 0.5);
				else
					$input.css("opacity", 1);

				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			this.init = function() {
				$input = $(
						"<IMG src='images/bullet_star.png' align=absmiddle tabIndex=0 title='Click or press Space to toggle' />")
						.bind("click keydown", toggle).appendTo(args.container)
						.focus();
			};

			this.destroy = function() {
				$input.unbind("click keydown", toggle);
				$input.remove();
			};

			this.focus = function() {
				$input.focus();
			};

			this.loadValue = function(item) {
				defaultValue = item[args.column.field];
				$input.css("opacity", defaultValue ? 1 : 0.2);
			};

			this.serializeValue = function() {
				return ($input.css("opacity") == "1");
			};

			this.applyValue = function(item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function() {
				return defaultValue != ($input.css("opacity") == "1");
			};

			this.validate = function() {
				return {
					valid : true,
					msg : null
				};
			};

			this.init();
		},

		/*
		 * An example of a "detached" editor. The UI is added onto document BODY
		 * and .position(), .show() and .hide() are implemented. KeyDown events
		 * are also handled to provide handling for Tab, Shift-Tab, Esc and
		 * Ctrl-Enter.
		 */
		LongTextCellEditor : function(args) {
			var $input, $wrapper;
			var defaultValue;
			var scope = this;

			this.init = function() {
				var $container = $("body");

				$wrapper = $(
						"<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:3px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
						.appendTo($container);

				$input = $(
						"<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>")
						.appendTo($wrapper);

				$(
						"<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
						.appendTo($wrapper);

				$wrapper.find("button:first").bind("click", this.save);
				$wrapper.find("button:last").bind("click", this.cancel);
				$input.bind("keydown", this.handleKeyDown);

				scope.position(args.position);
				$input.focus().select();
			};

			this.handleKeyDown = function(e) {
				if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
					scope.save();
				} else if (e.which == $.ui.keyCode.ESCAPE) {
					e.preventDefault();
					scope.cancel();
				} else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
					e.preventDefault();
					grid.navigatePrev();
				} else if (e.which == $.ui.keyCode.TAB) {
					e.preventDefault();
					grid.navigateNext();
				}
			};

			this.save = function() {
				args.commitChanges();
			};

			this.cancel = function() {
				$input.val(defaultValue);
				args.cancelChanges();
			};

			this.hide = function() {
				$wrapper.hide();
			};

			this.show = function() {
				$wrapper.show();
			};

			this.position = function(position) {
				$wrapper.css("top", position.top - 5).css("left",
						position.left - 5);
			};

			this.destroy = function() {
				$wrapper.remove();
			};

			this.focus = function() {
				$input.focus();
			};

			this.loadValue = function(item) {
				$input.val(defaultValue = item[args.column.field]);
				$input.select();
			};

			this.serializeValue = function() {
				return $input.val();
			};

			this.applyValue = function(item, state) {
				item[args.column.field] = state;
			};

			this.isValueChanged = function() {
				return (!($input.val() == "" && defaultValue == null))
						&& ($input.val() != defaultValue);
			};

			this.validate = function() {
				return {
					valid : true,
					msg : null
				};
			};

			this.init();
		}

	};

	$.extend(window, SlickEditor);

})(jQuery);

// Hilfsfunktionen

// Graph anzeigen

function graph(id) {
	
	$("#graph").append("<div class='graph" + id + "'></div>");

	$(".graph" + id)
			.attr("title", "jQuery-Dialog statt Javascript-Popup?")
			.html(
					"Graph für Zeile "
							+ id
							+ " wird dann hier angezeigt. Flash können wir einfach"
							+ "direkt einziehen. Beleg dafür:<br><br>"
							+ "<embed src='http://www.youtube.com/v/8PDRJ7HrzjM?fs=1&amp;hl=de_DE' width=620 height=400  type='application/x-shockwave-flash'></embed>")
			.dialog( {
				width	: 640,
				height	: 480,
				modal  	: false,
				buttons	: {	"In neuem Fenster öffnen": function() {
									$(this).dialog("close");
									alert ("Wenn ich groß bin, werde ich ein echtes Popup.");
									},
							"Schließen": function() { $(this).dialog("close"); }},
				close	: function () {$(".graph" + id).removeClass("graph" + id)}
			});
}

// Wert in deutschen Betrag mit . als Tausendertrenner und , als Dezimaltrener
function trennzeichen(val) {
	var sp = val.toString().split(".");

	tsnd = "";
	convert = "" + sp[0];
	for (i = convert.length; i > 0; i -= 3) {
		if (i > 3) {
			tsnd = "." + convert.substring(i - 3, i) + tsnd;
		} else {
			tsnd = convert.substring(0, i) + tsnd;
		}

	}
	if (!sp[1])
		sp[1] = "00";

	if (sp[1].length == 1)
		sp[1] = sp[1] + "0";

	_val = tsnd + "," + sp[1];
	return _val;
}