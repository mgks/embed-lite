// Interactive demo logic
const input = document.getElementById('url-input');
const btn = document.getElementById('render-btn');
const resultsContainer = document.getElementById('results-container');
const preview = document.getElementById('preview-output');
const codeOutput = document.getElementById('code-output');

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
    codeOutput.textContent = result.html;
    preview.innerHTML = result.html;

    // Re-mount provider scripts (Twitter, Instagram, Reddit embed.js)
    preview.querySelectorAll('script').forEach(old => {
        const s = document.createElement('script');
        s.src = old.src;
        s.async = true;
        document.body.appendChild(s);
    });
}

function showError(msg) {
    resultsContainer.style.display = 'flex';
    codeOutput.textContent = msg;
    preview.innerHTML = '';
}

// Generic copy-to-clipboard for any element with data-copy attribute.
// Works for all snippet copy buttons and the HTML output copy button.
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove('copied');
        }, 1500);
    });
}

document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.copy);
        if (target) copyText(target.textContent, btn);
    });
});

// Render button and Enter key
btn.addEventListener('click', render);
input.addEventListener('keypress', e => {
    if (e.key === 'Enter') render();
});

// Clear results when input emptied
input.addEventListener('input', e => {
    if (e.target.value.trim() === '') resultsContainer.style.display = 'none';
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
