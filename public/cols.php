
[ {
	"id" : "shop",
	"name" : "Shop",
	"field" : "shop",
	"width" : 120,
	"cssClass" : "cell-title",
	"visible" : false
}, {
	"id" : "portal",
	"name" : "Portal",
	"field" : "portal",
	"sortable" : true,
	"width" : 80,
	"cssClass" : "cell-title",
	"filter" : {
		"type" : "search"
	}
},	{
	"id" : "category",
	"name" : "Kategorie",
	"field" : "category",
	"cssClass" : "cell-title"
}, {
	"id" : "statewatch",
	"name" : "State-Watch",
	"field" : "statewatch",
	"width" : 80,
	"resizable" : false,
	"mouseOverEdit" : true
}, {
	"id" : "graph",
	"name" : "Graph",
	"field" : "graph",
	"width" : 40,
	"resizable" : false,
	"formatter" : "GraphCellFormatter"
}, {
	"id" : "state",
	"name" : "Status",
	"field" : "state",
	"width" : 120,
	"resizable" : false,
	"formatter" : "StateCellFormatter",
	"editor" : "StateCellEditor",
	"mouseOverEdit" : true
}, {
	"id" : "start",
	"name" : "Aktiv von",
	"field" : "start",
	"minWidth" : 60,
	"editor" : "DateCellEditor",
	"mouseOverEdit" : true
}, {
	"id" : "finish",
	"name" : "Aktiv bis",
	"field" : "finish",
	"minWidth" : 60,
	"editor" : "DateCellEditor"
}, {
	"id" : "perc",
	"name" : "Prozent",
	"field" : "perc",
	"cssClass" : "cell-right",
	"sortable" : true,
	"formatter" : "PercCellFormatter",
	"editor" : "TextCellEditor",
	"sum" : true,
	"rel" : true,
	"filter" : {
		"type" : "range"
		} ,
	"grade" : [{
		"bool" : [" != 0", " != 2", " <= 50"],
		"css" : "background : #ffbaba; color: #000000;"
	}, {
		"bool" : [" > 50"],
		"css" : "background : #c8ffc8; color: #000000;" 
	}, {
		"bool" : [" == 0"],
		"css" : "background : #c0c0ff" 
	}]
}, {
	"id" : "pbf",
	"name" : "PBF",
	"field" : "pbf",
	"width" : 30,
	"resizable" : false,
	"sortable" : true,
	"formatter" : "PbfCellFormatter"
}, {
	"id" : "checkf",
	"name" : "CF",
	"field" : "checkf",
	"width" : 30,
	"resizable" : false,
	"sortable" : true,
	"formatter" : "BoolCellFormatter",
	"filter" : {
		"type" : "check"
		} 
},	{
	"id" : "costs",
	"name" : "Costs",
	"field" : "costs",
	"cssClass" : "cell-right",
	"formatter" : "EuroCellFormatter",
	"sortable" : true,
	"sum" : true,
	"filter" : {
		"type" : "range",
		"value" : [10, 200]
		},
	"grade" : [{
		"bool" : [" < 5000"],
		"css" : "color:red;font-weight:bold;" 
	}, {
		"bool" : [" >= 5000"],
		"css" : "color:green;" 
	}]
},  {
	"id" : "clicks",
	"name" : "Klicks",
	"field" : "clicks",
	"cssClass" : "cell-right",
	"sortable" : true,
	"sum" : true,
	"filter" : {
		"type" : "range",
		"min" : 0,
		"max" : 10000,
		"minval" : 0,
		"maxval" : 10000
	}

}, 	{
	"id" : "memo",
	"name" : "Bemerkungen",
	"field" : "memo",
	"visible" : false,
	"editor" : "LongTextCellEditor"
} ]