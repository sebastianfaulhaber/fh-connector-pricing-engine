var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var pg = require('pg');

// Setup DB connection
var config = {
  user: 'mobiledb', //env var: PGUSER
  database: 'rhforumwien', //env var: PGDATABASE
  password: 'SaDach99!', //env var: PGPASSWORD
  host: '209.132.179.9', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 50, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
});

function pricingRoute() {
  var pricing = new express.Router();
  pricing.use(cors());
  pricing.use(bodyParser());


  // LIST PRICING ENTRIES
  pricing.get('/list', function(req, res) {

    // Execute query against database
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT * FROM "bam.unfall_neugeschaeft"', [], function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          res.json(err);
          console.error('error running query', err);
        }
        res.json(result);
      });
    });
  });

  // CALCULATE PRICING
  pricing.post('/calculate', function(req, res) {
    // Calculate the price
    var pricingRequest = req.body;
    var pricingResponse = {
      alter: pricingRequest.alter,
      grundsumme: pricingRequest.grundsumme,
      tarif: pricingRequest.tarif,
      dauer: pricingRequest.dauer,
      beitrag: calculatePremium(pricingRequest),
      msg: [] 
    }
    res.json(pricingResponse);

    // Insert calculation into database
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('INSERT INTO "bam.unfall_neugeschaeft"(alter, grundsumme, tarif, dauer, beitrag, vertriebskanal, datum) VALUES($1, $2, $3, $4, $5, $6, $7)', [pricingResponse.alter, pricingResponse.grundsumme, pricingResponse.tarif, pricingResponse.dauer, pricingResponse.beitrag, "Mobile", new Date()], function(err, result) {
      //client.query('INSERT INTO "bam.unfall_neugeschaeft"(alter) VALUES($1)', [30], function(err, result) {
        //call `done()` to release the client back to the pool
        done();
        if(err) {
          res.json(err);
          console.error('error running query', err);
        }
      });
    });
  });

  return pricing;
}

function calculatePremium(pricingRequest) {
  var premium = 2.25;

  // DAUER: Apply factor according to dauer
  if (pricingRequest.dauer <= '3') {
    premium *= pricingRequest.dauer;
  } else if (pricingRequest.dauer > '3' && pricingRequest.dauer <= '5') {
    premium *= pricingRequest.dauer * 0.85;
  } else if (pricingRequest.dauer > '5' && pricingRequest.dauer <= '7') {
    premium *= pricingRequest.dauer * 0.7;
  } else if (pricingRequest.dauer > '7' && pricingRequest.dauer <= '14') {
    premium *= pricingRequest.dauer * 0.6;
  } else if (pricingRequest.dauer > '14') {
    premium *= pricingRequest.dauer * 0.5;
  } else {
    // This should never be reached:
    // Make it insane expensive, just to be sure
    premium *= pricingRequest.dauer *100;
  }

  // ALTER: Apply risk add according to age
  if (pricingRequest.alter >= '18' && pricingRequest.alter < '30') {
    premium += 0.52;
  } else if (pricingRequest.alter >= '30' && pricingRequest.alter < '40') {
    premium += 1.52;
  } else if (pricingRequest.alter >= '40' && pricingRequest.alter < '50') {
    premium += 3.12;
  } else if (pricingRequest.alter >= '50' && pricingRequest.alter < '60') {
    premium += 6.32;
  } else if (pricingRequest.alter >= '60' && pricingRequest.alter < '70') {
    premium += 9.42;
  }

  // GRUNDSUMME: Apply factor according to grundsumme
  if (pricingRequest.grundsumme == '20.000') {
    premium *= 1.0;
  } else if (pricingRequest.grundsumme == '50.000') {
    premium *= 1.2;
  } else if (pricingRequest.grundsumme == '100.000') {
    premium *= 1.5;
  }

  // TARIF: Apply factor according to tariff version
  if (pricingRequest.tarif == 'Eco') {
    premium *= 1.0;
  } else if (pricingRequest.tarif == 'Standard') {
    premium *= 1.2;
  } else if (pricingRequest.tarif == 'Premium') {
    premium *= 1.5;
  }
  
  return Math.round10(premium, -2);
}


// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

module.exports = pricingRoute;
