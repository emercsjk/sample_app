/* V 1.0
 * 04.01.2010 Jan Kaiser (jan.kaiser@emercs.com)
 * 
 * Die Klasse RequestController nimmt Änderungen
 * aus der Tabelle entgegen, setzt sie über asynchrone
 * Requests um und kontrolliert deren Durchführung.
 * 
 * RequestController.requests enthält alle Requests mit Daten und Status
 * Dafür wird auf Request-Objekte aus request.js zurückgegriffen.
 */

//Konstruktor
function RequestController() {
	/* Instanzvariablen */
	this.requests = [];
	this.debug = false;

	/* Objekt-Methoden */
	// Inhalt HTML-formatiert als String, für Debug-Modus
	this.toString = RCtoString;

	// fügt einen Request hinzu, sendet ihn und kümmert sich um die Antwort,
	// benötigt als Parameter Action und JSON-Data
	this.sendRequest = RCsendRequest;

	// aktualisiert einen Request im Controller, wird per success-Callback
	// aufgerufen
	this.updateRequest = RCupdateRequest;

	// Laufen gerade Requests?
	this.idle = RCidle;
}

function RCtoString(dev) {
	str = "<b>RequestController:</b><br>";
	for (n in this.requests) {
		str += this.requests[n].toString() + "<br>";
	}
	str += "<b>Ready:</b> " + this.idle().toString();
	return str;
}
function RCsendRequest(_action, _data) {
	var _jetzt = new Date();
	var _rand = Math.round(Math.random()*1000000);
	
	// Eindeutige Request-ID, Timestamp mit Zufallszahl
	var _id = "requestid" + _jetzt.getTime() + _rand; 
	
	//Neues Request-Objekt erstellen
	var req = new Request();
	req.request["id"] = _id;
	req.request["timestamp"] = _jetzt.getTime();
	req.request["SessionID"] = "SessionID macht alles sicher";
	req.request["action"] = _action;
	req.request["data"] = _data;
	req.status = 2; // status = running

	// Request ins Array parken und Ajax ausführen
	this.requests.push(req);
	rc.idle();
	$.ajax( {
		url : 'webservice.php',
		type : 'POST',
		data : req.request,
		success : function(data) {
			rc.updateRequest(_id, data);
			rc.idle();
			if (rc.debug)
				$("#rc").html(rc.toString());
			else
				$("#rc").html(rc.toString());
		}
	});

	return _id;
}

function RCupdateRequest(id, data) {
	for (n in this.requests) {
		if (this.requests[n].request["id"] == id) {
			this.requests[n].status = 1;
			this.requests[n].response = data;
		}
	}
}

function RCidle() {
	var _idle = true;
	for (n in this.requests) {
		if (this.requests[n].status > 1)
			_idle = false;
	}
	if (_idle)
		$("#saving").hide("");
	else
		$("#saving").show("");

	return _idle;
}