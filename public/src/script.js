const input = document.getElementById('url-input');
const btn = document.getElementById('render-btn');
const resultsContainer = document.getElementById('results-container');
const preview = document.getElementById('preview-output');
const code = document.getElementById('code-output');

function render() {
    const url = input.value.trim();
    if (!url) return;

    if (typeof window.embedLite === 'undefined') {
        showError('Library not loaded.');
        return;
    }

    let result;
    try {
        result = window.embedLite.embed(url);
    } catch (e) {
        showError('Invalid URL.');
        console.error(e);
        return;
    }

    if (!result || !result.html) {
        showError('Unsupported URL format.');
        return;
    }

    resultsContainer.style.display = 'flex';
    code.textContent = result.html;
    preview.innerHTML = result.html;

    // Re-mount provider scripts (Twitter, Instagram, Reddit need embed.js)
    const scripts = preview.querySelectorAll('script');
    scripts.forEach(old => {
        const s = document.createElement('script');
        s.src = old.src;
        s.async = true;
        document.body.appendChild(s);
    });
}

function showError(msg) {
    resultsContainer.style.display = 'flex';
    code.innerHTML = '';
    code.textContent = msg;
    preview.innerHTML = '';
}

btn.addEventListener('click', render);
input.addEventListener('keypress', e => {
    if (e.key === 'Enter') render();
});

// Copy HTML output
document.getElementById('copy-btn').addEventListener('click', () => {
    const txt = code.textContent;
    if (!txt) return;
    navigator.clipboard.writeText(txt).then(() => {
        const b = document.getElementById('copy-btn');
        b.textContent = 'Copied';
        setTimeout(() => { b.textContent = 'Copy'; }, 1500);
    });
});

// Clear results when input emptied
input.addEventListener('input', e => {
    if (e.target.value.trim() === '') {
        resultsContainer.style.display = 'none';
    }
});

// Auto-render from ?url= query param
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
        input.value = urlParam;
        setTimeout(render, 500);
    }
});
