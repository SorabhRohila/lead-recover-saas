(function() {
    const currentScript = document.currentScript;
    const clientId = currentScript ? currentScript.getAttribute('data-account') : null;
    
    if (!clientId) {
        console.error("LeadRecover: Missing data-account ID");
        return;
    }

    let formData = {};
    
    function sendPayload() {
        if (Object.keys(formData).length === 0) return;
        
        const payload = JSON.stringify({
            client_id: clientId,
            source_url: window.location.href,
            data: formData
        });

        // Try beacon first for reliability when tab closes
        const beaconSent = navigator.sendBeacon("https://leadrecover.vercel.app/api/track", payload);
        
        if (!beaconSent) {
            fetch("https://leadrecover.vercel.app/api/track", {
                method: "POST",
                body: payload,
                keepalive: true
            }).catch(e => console.error("LeadRecover Error:", e));
        }
    }

    document.addEventListener('blur', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const name = e.target.name || e.target.id || 'unknown_field';
            const value = e.target.value.trim();
            if (value.length > 0) {
                formData[name] = value;
                sendPayload(); // Immediately fire the track request
            }
        }
    }, true);

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            sendPayload();
        }
    });
})();