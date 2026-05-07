(function() {
  // 1. Prevent the script from loading twice
  if (window.LeadRecoverInjected) return;
  window.LeadRecoverInjected = true;

  // 2. Find this script tag to get the user's ID
  const scriptTag = document.currentScript || document.querySelector('script[src*="lr.js"]');
  if (!scriptTag) return;
  
  const clientId = scriptTag.getAttribute('data-client');
  if (!clientId) {
    console.error('LeadRecover: Missing data-client ID.');
    return;
  }

  let capturedData = {};
  let hasSubmitted = false;

  // 3. Listen to see if they actually submit the form (we don't want to steal successful conversions)
  document.addEventListener('submit', function() {
    hasSubmitted = true;
  });

  // 4. Secretly listen every time they type in an input field and click away (blur)
  document.addEventListener('blur', function(e) {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const name = target.name || target.id || target.type || 'unknown_field';
      const val = target.value.trim();
      
      // If it's an email, phone, or text, save it locally
      if (val && target.type !== 'password') {
        capturedData[name] = val;
      }
    }
  }, true);

  // 5. Detect when they close the tab, switch tabs, or hit the back button
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden' && !hasSubmitted && Object.keys(capturedData).length > 0) {
      
      // Build the URL to send the data back to your Next.js backend
      const scriptUrl = new URL(scriptTag.src);
      const backendUrl = scriptUrl.origin + '/api/track';

      const payload = {
        client_id: clientId,
        source_url: window.location.href,
        data: capturedData
      };

      // sendBeacon is a special browser feature that reliably sends data EVEN as the tab is closing
      navigator.sendBeacon(backendUrl, JSON.stringify(payload));
    }
  });
})();