(function() {
    const currentScript = document.currentScript;
    const clientId = currentScript ? currentScript.getAttribute('data-account') : null;
    
    // Generate a unique tag for this user's visit
    const sessionId = Date.now().toString() + Math.random().toString().substr(2);
    
    if (!clientId) return;

    let formData = {};
    
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
        
        // Sneak the session ID into the data
        formData['lr_session_id'] = sessionId;

        const payload = JSON.stringify({
            client_id: clientId,
            source_url: window.location.href,
            data: formData
        });

        const beaconSent = navigator.sendBeacon("https://leadrecover.vercel.app/api/track", payload);
        if (!beaconSent) {
            fetch("https://leadrecover.vercel.app/api/track", {
                method: "POST", body: payload, keepalive: true
            }).catch(e => console.error(e));
        }
    }

    document.addEventListener('blur', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const name = e.target.name || e.target.id || 'unknown_field';
            const value = e.target.value.trim();
            if (value.length > 0) {
                formData[name] = value;
                sendPayload();
            }
        }
    }, true);

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') sendPayload();
    });
})();