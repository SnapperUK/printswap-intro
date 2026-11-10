/*
 * Print Swap: analytics consent and Google Analytics.
 *
 * Nothing loads from Google until the visitor clicks Accept. The choice is
 * remembered in this browser (localStorage) and can be changed from the
 * "Cookie settings" link added to the footer. Self-contained: styles are
 * injected here so the bar works on pages with their own stylesheet (/get).
 *
 * Also tracks App Store button taps: any element with data-cta sends an
 * event, with data-cta-location as its location.
 */
(function () {
    'use strict';

    var GA_ID = 'G-VPE3T276G6';
    var KEY = 'ps-analytics-consent'; // 'granted' | 'denied'
    var loaded = false;
    var consented = false; // current choice on this page; gates tap events

    function getChoice() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function setChoice(value) {
        try { localStorage.setItem(KEY, value); } catch (e) { /* private mode: choice lasts this page only */ }
    }

    function loadAnalytics() {
        consented = true;
        if (loaded) {
            // Accepted again after a Decline on this page: re-grant.
            window.gtag('consent', 'update', { analytics_storage: 'granted' });
            return;
        }
        loaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        });
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, { allow_google_signals: false });
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
    }

    function stopAnalytics() {
        consented = false;
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', { analytics_storage: 'denied' });
        }
        // Remove Google Analytics cookies already set on this site.
        var host = location.hostname.replace(/^www\./, '');
        document.cookie.split(';').forEach(function (c) {
            var name = c.split('=')[0].trim();
            if (name === '_ga' || name.indexOf('_ga_') === 0) {
                ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
                });
            }
        });
    }

    var CSS = [
        '.ps-consent{position:fixed;left:0;right:0;bottom:0;z-index:1000;background:#ffffff;',
        'border-top:1px solid #e5e5e5;box-shadow:0 -4px 16px rgba(0,0,0,.06);padding:16px;',
        'font-family:\'Quattrocento Sans\',-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;color:#003d5b}',
        '.ps-consent-inner{max-width:52rem;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px}',
        '.ps-consent p{flex:1 1 20rem;margin:0;font-size:15px;line-height:1.45}',
        '.ps-consent a{color:#30638e}',
        '.ps-consent-actions{display:flex;gap:10px;flex:0 0 auto}',
        '.ps-consent button{font:inherit;font-size:15px;font-weight:700;padding:10px 18px;border-radius:6px;cursor:pointer;',
        'border:1px solid #003d5b;min-width:6.5rem}',
        '.ps-consent .ps-decline{background:#ffffff;color:#003d5b}',
        '.ps-consent .ps-accept{background:#003d5b;color:#ffffff}',
        '.ps-consent button:focus-visible{outline:2px solid #30638e;outline-offset:2px}',
        '@media (max-width:480px){.ps-consent-actions{width:100%}.ps-consent button{flex:1}}'
    ].join('');

    var bar = null;

    // Keep page content (e.g. the App Store button) scrollable above the bar.
    function makeRoom(on) {
        document.body.style.paddingBottom = on && bar ? bar.offsetHeight + 'px' : '';
    }

    function hideBar() {
        bar.hidden = true;
        makeRoom(false);
    }

    function showBar() {
        if (bar) { bar.hidden = false; makeRoom(true); return; }
        if (!document.getElementById('ps-consent-style')) {
            var st = document.createElement('style');
            st.id = 'ps-consent-style';
            st.textContent = CSS;
            document.head.appendChild(st);
        }
        bar = document.createElement('div');
        bar.className = 'ps-consent';
        bar.setAttribute('role', 'region');
        bar.setAttribute('aria-label', 'Cookie choice');
        bar.innerHTML =
            '<div class="ps-consent-inner">' +
            '<p>Can we use analytics cookies to see how people find Print Swap? ' +
            'Nothing is tracked unless you accept. <a href="/privacy">Privacy policy</a></p>' +
            '<div class="ps-consent-actions">' +
            '<button type="button" class="ps-decline">Decline</button>' +
            '<button type="button" class="ps-accept">Accept</button>' +
            '</div></div>';
        bar.querySelector('.ps-accept').addEventListener('click', function () {
            setChoice('granted');
            hideBar();
            loadAnalytics();
        });
        bar.querySelector('.ps-decline').addEventListener('click', function () {
            setChoice('denied');
            hideBar();
            stopAnalytics();
        });
        document.body.appendChild(bar);
        makeRoom(true);
        window.addEventListener('resize', function () { if (!bar.hidden) makeRoom(true); });
    }

    function addSettingsLink() {
        var links = document.querySelector('.footer-links');
        if (!links) return;
        var sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = '·';
        var a = document.createElement('a');
        a.href = '#cookie-settings';
        a.textContent = 'Cookie settings';
        a.addEventListener('click', function (e) { e.preventDefault(); showBar(); });
        links.appendChild(document.createTextNode(' '));
        links.appendChild(sep);
        links.appendChild(document.createTextNode(' '));
        links.appendChild(a);
    }

    // App Store button taps (only sent once analytics is on).
    document.addEventListener('click', function (e) {
        var el = e.target.closest && e.target.closest('[data-cta]');
        if (!el || !consented || typeof window.gtag !== 'function') return;
        window.gtag('event', el.dataset.cta, { location: el.dataset.ctaLocation || '' });
    });

    function init() {
        addSettingsLink();
        var choice = getChoice();
        if (choice === 'granted') loadAnalytics();
        else if (choice !== 'denied') showBar();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
