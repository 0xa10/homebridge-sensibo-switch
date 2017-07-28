request = require('request')
var Service, Characteristic;


module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-sensibo-switch", "SimpleSensiboSwitch", SimpleSensiboSwitch);
}


function SimpleSensiboSwitch(log, config) {
    this.log = log;

    // url info
    this.name = config["name"];
    this.api_key = config["apiKey"];
    this.device = config["device"];
}

var _SERVER = 'https://home.sensibo.com/api/v2'

SimpleSensiboSwitch.prototype = {

    getPowerState: function (callback) {
        // Get Sensibo power info
        var options = {
            url: _SERVER + "/pods/" + this.device + "/acStates",
            qs: {
                    'limit': 1,
                    'fields': 'status,reason,acState',
                    'apiKey': this.api_key
                }
        };
        request.get(options, function(error, response, body) {
                if (!error) {
                    if (response && response.statusCode == 200) {
                        console.log("Got power state ");
                        callback(null, JSON.parse(body).result[0].acState.on);
                    }
                }
            } );
    },

    setPowerState: function(powerOn, callback) {
        // Turn Sensibo on/off, then callback
        device = this.device
        api_key = this.api_key
        var options = {
            url: _SERVER + "/pods/" + device + "/acStates",
            qs: {
                    'limit': 1,
                    'fields': 'status,reason,acState',
                    'apiKey': api_key
                }
        };
        request.get(options, function(error, response, body) {
                if (!error && response && response.statusCode == 200) {
                    var options_put = {
                        url: _SERVER + "/pods/" + device + "/acStates/on",
                        qs: { "apiKey": api_key },
                        body: {'currentAcState': JSON.parse(body).result[0].acState, 'newValue': !!powerOn},
                        json: true
                    }
                    request.patch(options_put, function(error, reponse, body) {
                        if (!error) {
                            if (response && response.statusCode == 200) {
                                console.log("setPowerState: Power state sent, result " + reponse.statusCode);
                                callback(null)
                            } else {
                                callback(error);
                            }
                        }
                    } );
                }
            } );
    },

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function () {
        var informationService = new Service.AccessoryInformation();

        informationService
                .setCharacteristic(Characteristic.Manufacturer, "Sensibo")
                .setCharacteristic(Characteristic.Model, "Sensibo")
                .setCharacteristic(Characteristic.SerialNumber, "311");

        switchService = new Service.Switch(this.name);
        switchService
                .getCharacteristic(Characteristic.On)
                .on('get', this.getPowerState.bind(this))
                .on('set', this.setPowerState.bind(this));

    
        return [switchService];
    }
};
