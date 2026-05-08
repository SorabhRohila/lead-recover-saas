(function() {
    // 1. Get the account ID securely from the script tag
    const scriptTag = document.currentScript || document.querySelector('script[src*="lr.js"]');
    if (!scriptTag) return;
    
    const accountId = scriptTag.getAttribute('data-account');
    if (!accountId) {
        console.error('LeadRecover: Missing data-account attribute');
        return;
    }

    // 2. Storage for captured data
    let formData = {};
    let debounceTimer;

    // 3. Smart Field Identifier (WordPress & Custom PHP friendly)
    function getFieldName(input) {
        let name = (input.name || '').toLowerCase();
        let type = (input.type || '').toLowerCase();
        let id = (input.id || '').toLowerCase();
        let placeholder = (input.placeholder || '').toLowerCase();

        // If it's an email field (Elementor/WPForms often use weird names but standard types)
        if (type === 'email' || name.includes('email') || id.includes('email') || placeholder.includes('email')) {
            return 'email';
        }
        
        // If it's a phone field
        if (type === 'tel' || name.includes('phone') || name.includes('tel') || id.includes('phone') || placeholder.includes('phone')) {
            return 'phone';
        }
        
        // If it's a name field
        if (name.includes('name') || id.includes('name') || name.includes('fname') || placeholder.includes('name')) {
            return 'name';
        }

        // Fallback to whatever name or ID it has
        return input.name || input.id || type || 'unknown_field';
    }

    // 4. Capture data globally (Handles Elementor Popups dynamically)
    document.addEventListener('input', function(e) {
        const target = e.target;
        
        // Only care about inputs, textareas, and selects
        if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
        
        // Ignore sensitive/useless fields
        if (['password', 'hidden', 'submit', 'button', 'file'].includes(target.type)) return;

        const fieldName = getFieldName(target);
        const fieldValue = target.value.trim();

        if (!fieldValue) return; // Don't save empty keystrokes

        // Store the value
        formData[fieldName] = fieldValue;

        // 5. Debounce the API call (Wait 1.5 seconds after they stop typing before sending)
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            sendData(formData);
        }, 1500);
    });

    // 6. Send data to your Next.js Backend
    function sendData(data) {
        // Optional: Only send if we have an email or phone number (Saves your database from useless data)
        if (!data.email && !data.phone) return;

        // IMPORTANT: Make sure this URL matches your actual API route!
        fetch('https://leadrecover.vercel.app/api/capture', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                account_id: accountId,
                domain: window.location.hostname,
                url: window.location.href,
                data: data
            })
        }).catch(err => console.error('LeadRecover error:', err));
    }
})();