/* V 1.0
 * 04.01.2010 Jan Kaiser (jan.kaiser@emercs.com)
 * 
 * Die Klasse Request definiert einen Request. Ein Request hat 
 * 
 * - ein Ajax-Request-Objekt
 * - einen Status
 * - einen Timestamp
 * - ein Ajax-Response-Objekt
 * 
 */

//Request-Statuscodes auf Strings gemappt
//2 ist "running", damit mit status<2 auf idle getestet werden kann
var requestStatus = {
	0 : "init",
	1 : "done",
	2 : "running"
};

// Konstruktor
function Request() {
	// Instanzvariablen
	this.status = 0; // siehe requestStatus
	this.date = new Date();
	this.request = {};
	this.response = "";

	// Objekt-Methoden
	this.toString = RtoString;
}

function RtoString() {
	str = "";
	rData = this.request["data"];
	str += "<b>Request:</b> ";
	if (this.request["action"] == "UPDATE") {
		str += "UPDATE: " + rData["table"] + " SET ";
		str += rData["column"] + "=" + rData["newValue"] + " WHERE id="
				+ rData["where"];
		str += " [Alter Wert: " + rData["oldValue"] + "]";
	} else if (this.request["action"] == "OPTIONS") {
		str += "OPTIONS: " + rData["table"] + " SET " + rData["column"]
				+ " visible: " + rData["visible"];
	} else
		str += "Unbekannte Aktion: " + this.request["action"];

	str += " <i>(Status: " + requestStatus[this.status]
			+ ")</i> / <b>Response:</b> " + this.response;
	return str;

}