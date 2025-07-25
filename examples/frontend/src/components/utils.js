export function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[tag]));
}

export function parseFormattedText(content) {
  if (!content || typeof content !== 'string') return '';

  const lines = content.split('\n');
  let html = '';
  let insideList = false;
  let insideCodeBlock = false;

  for (let line of lines) {
    const trimmed = line.trim();

    // Code block start/end
    if (trimmed.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock;
      html += insideCodeBlock
        ? `<pre style="background:#f6f8fa;padding:10px;border-radius:6px;font-family:monospace;font-size:14px;white-space:pre-wrap;overflow-x:auto;word-break:break-word;">`
        : '</pre>';
      continue;
    }

    if (insideCodeBlock) {
      html += escapeHTML(line) + '\n';
      continue;
    }

    // Headers
    if (/^#{1,6} /.test(trimmed)) {
      const level = trimmed.match(/^#+/)[0].length;
      const content = escapeHTML(trimmed.replace(/^#+ /, ''));
      html += `<h${level-2} style="margin:8px 0;">${content}</h${level}>`;
      continue;
    }

    // Lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!insideList) {
        html += '<ul style="padding-left: 20px; margin: 0;">';
        insideList = true;
      }
      html += `<li style="margin-bottom: 4px;">${escapeHTML(trimmed.slice(2))}</li>`;
      continue;
    } else if (insideList) {
      html += '</ul>';
      insideList = false;
    }

    if (trimmed) {
      html += `<p style="margin: 6px 0;">${escapeHTML(trimmed)}</p>`;
    }
  }

  if (insideList) html += '</ul>';
  if (insideCodeBlock) html += '</pre>';

  return html;
}

export function parseAdvancedText(content) {
  let html = parseFormattedText(content);

  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')         // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')                     // Italic
    .replace(/`([^`]+?)`/g, '<code style="font-size: 1.1em; background: #f3f6ff; padding: 2px 4px; border-radius: 4px;">$1</code>') // Inline code
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,                     // Links
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  return html;
}
