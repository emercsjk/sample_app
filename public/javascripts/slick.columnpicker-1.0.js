(function($) {
	function SlickColumnPicker(columns,grid)
	{
		var $menu;

		//Enthält alle Spalten-IDs und ihren Sichtbarkeitsstatus 
		var cols = [];
		
		function init() {
			grid.onHeaderContextMenu = displayContextMenu;

			$menu = $("<span class='slick-columnpicker' style='display:none;position:absolute;z-index:20;' />").appendTo(document.body);

			$menu.bind("mouseleave", function(e) { $(this).fadeOut(); });
			$menu.bind("click", updateColumn);

		}

		function displayContextMenu(e)
		{
			$menu.empty();
			$("<span></span>").appendTo($menu);
			var visibleColumns = grid.getColumns();
			var $li, $input;
			for (var i=0; i<columns.length; i++) {
				$li = $("<li />").appendTo($menu);

				$input = $("<input type='checkbox' />")
                        .attr("id", "columnpicker_" + i)
                        .data("id", columns[i].id)
                        .appendTo($li);

                if (grid.getColumnIndex(columns[i].id) != null)
                    $input.attr("checked","checked");

				$("<label for='columnpicker_" + i + "' />")
					.text(columns[i].name)
					.appendTo($li);
				cols['columnpicker_' + i] = {
						c : columns[i].id,
						visible : true
				};
			}

			

			$menu
				.css("top", e.pageY - 10)
				.css("left", e.pageX - 10)
				.fadeIn();
		}

		function updateColumn(e)
		{
			
			if (e.target.id == 'autoresize') {
				if (e.target.checked) {
					grid.setOptions({forceFitColumns: true});
					grid.autosizeColumns();
				} else {
					grid.setOptions({forceFitColumns: false});
				}
				return;
			}

			if (e.target.id == 'syncresize') {
				if (e.target.checked) {
					grid.setOptions({syncColumnCellResize: true});
				} else {
					grid.setOptions({syncColumnCellResize: false});
				}
				return;
			}

			if ($(e.target).is(":checkbox")) {
				
				if ($menu.find(":checkbox:checked").length == 0) {
					$(e.target).attr("checked","checked");
					return;
				}

                var visibleColumns = [];
                $menu.find(":checkbox[id^=columnpicker]").each(function(i,e) {
                	               	
                    if ($(this).is(":checked")) {
                        visibleColumns.push(columns[i]);
                    }
                });
                var changedVis = false;
                changedCol = cols[e.target.id].c;
                
                grid.setColumns(visibleColumns);
			}
			//Option per Ajax verschicken
			optionsData = {
					table : "ShopTabelle",
					column : changedCol,
					visible : changedVis
				},
			rc.sendRequest("OPTIONS", optionsData);
			
		}


		init();
	}

	// Slick.Controls.ColumnPicker
	$.extend(true, window, { Slick: { Controls: { ColumnPicker: SlickColumnPicker }}});
})(jQuery);
