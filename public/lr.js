(function() {
    const currentScript = document.currentScript || document.querySelector('script[src*="lr.js"]');
    const clientId = currentScript ? currentScript.getAttribute('data-account') : null;
    const sessionId = Date.now().toString() + Math.random().toString().substr(2);
    
    if (!clientId) return;

    let formData = {};
    let lastSentData = "";

    // --- NEW: Universal Smart Scanner ---
    function getSmartFieldName(el) {
        const nameAttr = (el.name || '').toLowerCase();
        const idAttr = (el.id || '').toLowerCase();
        const typeAttr = (el.type || '').toLowerCase();
        const placeAttr = (el.placeholder || '').toLowerCase();
        const autoAttr = (el.autocomplete || '').toLowerCase();

        // Combine all hints into one string to scan
        const hints = nameAttr + " " + idAttr + " " + typeAttr + " " + placeAttr + " " + autoAttr;

        if (hints.includes('email')) return 'email';
        if (hints.includes('phone') || hints.includes('tel') || hints.includes('mobile') || hints.includes('number')) return 'phone';
        if (hints.includes('name') || hints.includes('first') || hints.includes('last') || hints.includes('fname')) return 'name';
        if (hints.includes('company') || hints.includes('business')) return 'company';

        // Fallback
        return el.name || el.id || 'field_' + Math.random().toString(36).substr(2, 5);
    }

    function sendPayload() {
        if (Object.keys(formData).length === 0) return;

        let hasName = false;
        let hasContact = false;

        for (let key in formData) {
            let k = key.toLowerCase();
            if (k.includes('name') || k.includes('first') || k.includes('last')) hasName = true;
            if (k.includes('phone') || k.includes('tel') || k.includes('email') || k.includes('number')) hasContact = true;
        }

        if (!hasName || !hasContact) return; 
        
        // Copy formData so we don't mess up the loop
        let payloadData = Object.assign({}, formData);
        payloadData['lr_session_id'] = sessionId;
        
        // --- PREVENT RACE CONDITION ---
        const currentDataString = JSON.stringify(payloadData);
        if (currentDataString === lastSentData) return;
        lastSentData = currentDataString;
        // ------------------------------

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

    // Listens for when a user clicks outside of an input (blur)
    document.addEventListener('blur', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            
            // Ignore useless fields like passwords and submit buttons
            const type = e.target.type;
            if (type === 'password' || type === 'submit' || type === 'button' || type === 'hidden') return;

            // Use the Smart Scanner to find the true name
            const fieldName = getSmartFieldName(e.target);
            const value = e.target.value.trim();

            if (value.length > 0) {
                formData[fieldName] = value;
                sendPayload();
            }
        }
    }, true);

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') sendPayload();
    });
})();