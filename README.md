# homebridge-sensibo-switch

Simple Sensibo homebridge plugin
Based on https://github.com/lucacri/homebridge-http-simple-switch

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-sensibo-switch
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration



Configuration sample:

 ```
"accessories": [
        {
            "accessory": "SimpleSensiboSwitch",
            "name": "Sensibo",
            "apiKey": "[apiKey]",
            "device":"[device]"
        }
    ]
```# homebridge-sensibo-switch
