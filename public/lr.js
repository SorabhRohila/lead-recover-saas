(function() {
    const currentScript = document.currentScript || document.querySelector('script[src*="lr.js"]');
    const clientId = currentScript ? currentScript.getAttribute('data-account') : null;
    const sessionId = Date.now().toString() + Math.random().toString().substr(2);
    
    if (!clientId) return;

    let formData = {};
    let lastSentData = "";
    let formHasBeenSubmitted = false; 

    function getSmartFieldName(el) {
        const nameAttr = (el.name || '').toLowerCase();
        const idAttr = (el.id || '').toLowerCase();
        const typeAttr = (el.type || '').toLowerCase();
        const placeAttr = (el.placeholder || '').toLowerCase();
        const autoAttr = (el.autocomplete || '').toLowerCase();

        const hints = nameAttr + " " + idAttr + " " + typeAttr + " " + placeAttr + " " + autoAttr;

        if (hints.includes('email')) return 'email';
        if (hints.includes('phone') || hints.includes('tel') || hints.includes('mobile') || hints.includes('number')) return 'phone';
        if (hints.includes('name') || hints.includes('first') || hints.includes('last') || hints.includes('fname')) return 'name';
        if (hints.includes('company') || hints.includes('business')) return 'company';

        return el.name || el.id || 'field_' + Math.random().toString(36).substr(2, 5);
    }

    // Scrapes all inputs instantly (used right before submit)
    function scrapeAllInputs() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!['password', 'submit', 'button', 'hidden'].includes(input.type)) {
                const val = input.value.trim();
                if (val) formData[getSmartFieldName(input)] = val;
            }
        });
    }

    function sendPayload(isSubmit = false) {
        // If it was already locked from a submit, ignore any tab closures or blurs
        if (formHasBeenSubmitted && !isSubmit) return;

        if (Object.keys(formData).length === 0) return;

        let hasName = false;
        let hasContact = false;

        for (let key in formData) {
            let k = key.toLowerCase();
            if (k.includes('name') || k.includes('first') || k.includes('last')) hasName = true;
            if (k.includes('phone') || k.includes('tel') || k.includes('email') || k.includes('number')) hasContact = true;
        }

        if (!isSubmit && (!hasName || !hasContact)) return; 
        
        let payloadData = Object.assign({}, formData);
        payloadData['lr_session_id'] = sessionId;

        if (isSubmit) {
            payloadData['is_submitted'] = true;
            formHasBeenSubmitted = true; // Lock the script for this page lifecycle
        }
        
        const currentDataString = JSON.stringify(payloadData);
        if (!isSubmit && currentDataString === lastSentData) return;
        lastSentData = currentDataString;

        const payload = JSON.stringify({
            client_id: clientId,
            source_url: window.location.href,
            data: payloadData
        });

        const beaconSent = navigator.sendBeacon("https://leadrecover.vercel.app/api/track", payload);
        if (!beaconSent) {
            fetch("https://leadrecover.vercel.app/api/track", {
                method: "POST", body: payload, keepalive: true
            }).catch(e => console.error(e));
        }
    }

    // 1. Capture as they type and click away
    document.addEventListener('blur', function(e) {
        if (formHasBeenSubmitted) return; // Don't run if already submitted
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            const type = e.target.type;
            if (type === 'password' || type === 'submit' || type === 'button' || type === 'hidden') return;

            const value = e.target.value.trim();
            if (value.length > 0) {
                formData[getSmartFieldName(e.target)] = value;
                sendPayload();
            }
        }
    }, true);

    // 2. Capture if they close the tab
    document.addEventListener('visibilitychange', function() {
        if (formHasBeenSubmitted) return; // Don't run if already submitted
        if (document.visibilityState === 'hidden') sendPayload();
    });

    // 3. Capture the actual submit
    document.addEventListener('submit', function(e) {
        scrapeAllInputs(); // Force grab everything instantly
        sendPayload(true);
    }, true);

    // 4. Capture the button click (for tricky WordPress forms)
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (target.type === 'submit' || target.closest('button[type="submit"]') || target.closest('input[type="submit"]')) {
            scrapeAllInputs(); // Force grab everything instantly
            sendPayload(true);
        }
    }, true);

})();