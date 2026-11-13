/* Live prices for /pricing.
   Reads two public documents from Firestore over plain HTTPS (no SDK, no login):
     pricing/{size}               -> gbp_amount (pence)
     config/shipping_pricing      -> bands.{A,B,C,D}.price_pence
   The figures already in the HTML are the fallback. This script only overwrites
   them when every value in a table passes a sanity check. On any failure it
   leaves the page exactly as shipped: no spinner, no message. */
(function () {
    'use strict';

    var BASE = 'https://firestore.googleapis.com/v1/projects/print-swap-ig/databases/(default)/documents';
    var TIMEOUT_MS = 6000;

    // Sanity ranges, in pence. A value outside these is treated as a database mistake.
    var PRINT_MIN = 500, PRINT_MAX = 50000;     // 5 to 500 pounds
    var SHIPPING_MIN = 500, SHIPPING_MAX = 10000; // 5 to 100 pounds

    var SIZE_IDS = ['standard_8x10', 'medium_11x14', 'large_16x20', 'extra_large_20x24'];
    var BAND_IDS = ['A', 'B', 'C', 'D'];

    var printTable = document.getElementById('print-prices');
    var shippingTable = document.getElementById('shipping-prices');
    if (!printTable || !shippingTable || !window.fetch) { return; }

    // Current state starts as the fallback figures baked into the HTML.
    var prices = { size: {}, band: {} };
    readFallback(printTable, 'data-size', prices.size);
    readFallback(shippingTable, 'data-band', prices.band);

    function readFallback(table, attr, target) {
        var rows = table.querySelectorAll('tbody tr');
        for (var i = 0; i < rows.length; i++) {
            var key = rows[i].getAttribute(attr);
            var pence = parseInt(rows[i].getAttribute('data-pence'), 10);
            if (key && isFinite(pence)) { target[key] = pence; }
        }
    }

    function formatPence(pence) {
        var pounds = pence / 100;
        return '£' + (pence % 100 === 0 ? String(pounds) : pounds.toFixed(2));
    }

    function render() {
        paint(printTable, 'data-size', prices.size);
        paint(shippingTable, 'data-band', prices.band);
        var print8 = prices.size.standard_8x10;
        var bandA = prices.band.A;
        setText('example-print', formatPence(print8));
        setText('example-shipping', formatPence(bandA));
        setText('example-total', formatPence(print8 + bandA));
    }

    function paint(table, attr, values) {
        var rows = table.querySelectorAll('tbody tr');
        for (var i = 0; i < rows.length; i++) {
            var key = rows[i].getAttribute(attr);
            var cell = rows[i].querySelector('td');
            if (cell && isFinite(values[key])) { cell.textContent = formatPence(values[key]); }
        }
    }

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) { el.textContent = text; }
    }

    function getJson(path) {
        var controller = window.AbortController ? new AbortController() : null;
        var timer = controller ? setTimeout(function () { controller.abort(); }, TIMEOUT_MS) : null;
        return fetch(BASE + '/' + path, controller ? { signal: controller.signal } : undefined)
            .then(function (res) {
                if (timer) { clearTimeout(timer); }
                if (!res.ok) { throw new Error('HTTP ' + res.status); }
                return res.json();
            });
    }

    function wholePence(field, min, max) {
        if (!field || field.integerValue === undefined) { return null; }
        var n = Number(field.integerValue);
        return (isFinite(n) && n % 1 === 0 && n >= min && n <= max) ? n : null;
    }

    // Returns {id: pence} only if all four known sizes are present and valid; otherwise null.
    function parsePrints(data) {
        var docs = (data && data.documents) || [];
        var found = {};
        for (var i = 0; i < docs.length; i++) {
            var id = String(docs[i].name || '').split('/').pop();
            if (SIZE_IDS.indexOf(id) === -1) {
                if (window.console) { console.warn('[pricing] ignoring unknown size', id); }
                continue;
            }
            found[id] = wholePence(docs[i].fields && docs[i].fields.gbp_amount, PRINT_MIN, PRINT_MAX);
        }
        for (var j = 0; j < SIZE_IDS.length; j++) {
            if (found[SIZE_IDS[j]] === null || found[SIZE_IDS[j]] === undefined) { return null; }
        }
        return found;
    }

    function parseShipping(data) {
        var bands = data && data.fields && data.fields.bands && data.fields.bands.mapValue &&
            data.fields.bands.mapValue.fields;
        if (!bands) { return null; }
        var found = {};
        for (var i = 0; i < BAND_IDS.length; i++) {
            var band = bands[BAND_IDS[i]];
            var fields = band && band.mapValue && band.mapValue.fields;
            var pence = fields ? wholePence(fields.price_pence, SHIPPING_MIN, SHIPPING_MAX) : null;
            if (pence === null) { return null; }
            found[BAND_IDS[i]] = pence;
        }
        return found;
    }

    // The two requests are independent: a failure in one leaves that table on its fallback.
    getJson('pricing').then(function (data) {
        var parsed = parsePrints(data);
        if (parsed) { prices.size = parsed; render(); }
    }).catch(function () { /* keep fallback, stay silent */ });

    getJson('config/shipping_pricing').then(function (data) {
        var parsed = parseShipping(data);
        if (parsed) { prices.band = parsed; render(); }
    }).catch(function () { /* keep fallback, stay silent */ });
})();
