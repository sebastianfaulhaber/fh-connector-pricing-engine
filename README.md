# Pricing MBaaS

Insurance pricing API. 

# Group Pricing API

# Pricing [/pricing/calculate]

## pricing/calculate [POST] 

Calculate premium.

+ Request (application/json)
    + Body
            {
            "alter": 20,
            "grundsumme": "100.000",
            "tarif": "Eco",
            "dauer": 14
            }

+ Response 200 (application/json)
    + Body
            {
              "alter": 20,
              "grundsumme": "100.000",
              "tarif": "Eco",
              "dauer": 14,
              "beitrag": 24.41,
              "msg": []
            }

# Pricing [/pricing/list]

## pricing/list [GET]

List quotes.

+ Request (application/json)
    + Body
            {
            }

+ Response 200 (application/json)
    + Body
            {
              "command": "SELECT",
              "rowCount": 95,
              "oid": null,
              "rows": [
                {
                  "alter": 30,
                  "grundsumme": "50.000",
                  "tarif": "Eco",
                  "dauer": 3,
                  "beitrag": "5",
                  "vertriebskanal": "Vermittler",
                  "datum": "2016-09-21T22:00:00.000Z"
                },
                {
                  "alter": 27,
                  "grundsumme": "20.000",
                  "tarif": "Standard",
                  "dauer": 5,
                  "beitrag": "12",
                  "vertriebskanal": "Vermittler",
                  "datum": "2016-09-21T22:00:00.000Z"
                }
              ],
              "fields": [
                {
                  "name": "alter",
                  "tableID": 16410,
                  "columnID": 1,
                  "dataTypeID": 23,
                  "dataTypeSize": 4,
                  "dataTypeModifier": -1,
                  "format": "text"
                },
                {
                  "name": "grundsumme",
                  "tableID": 16410,
                  "columnID": 2,
                  "dataTypeID": 1043,
                  "dataTypeSize": -1,
                  "dataTypeModifier": 54,
                  "format": "text"
                },
                {
                  "name": "tarif",
                  "tableID": 16410,
                  "columnID": 3,
                  "dataTypeID": 1043,
                  "dataTypeSize": -1,
                  "dataTypeModifier": 54,
                  "format": "text"
                },
                {
                  "name": "dauer",
                  "tableID": 16410,
                  "columnID": 4,
                  "dataTypeID": 23,
                  "dataTypeSize": 4,
                  "dataTypeModifier": -1,
                  "format": "text"
                },
                {
                  "name": "beitrag",
                  "tableID": 16410,
                  "columnID": 5,
                  "dataTypeID": 1700,
                  "dataTypeSize": -1,
                  "dataTypeModifier": -1,
                  "format": "text"
                },
                {
                  "name": "vertriebskanal",
                  "tableID": 16410,
                  "columnID": 6,
                  "dataTypeID": 1043,
                  "dataTypeSize": -1,
                  "dataTypeModifier": 54,
                  "format": "text"
                },
                {
                  "name": "datum",
                  "tableID": 16410,
                  "columnID": 7,
                  "dataTypeID": 1114,
                  "dataTypeSize": 8,
                  "dataTypeModifier": -1,
                  "format": "text"
                }
              ],
              "_parsers": [
                null,
                null,
                null,
                null,
                null,
                null,
                null
              ],
              "rowAsArray": false
            }