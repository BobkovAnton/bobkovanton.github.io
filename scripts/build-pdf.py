#!/usr/bin/env python3
"""Build the downloadable CV from the current website, preserving live links."""
import io
import hashlib
import json
import re
from pathlib import Path
import subprocess
from urllib.parse import unquote, urlsplit, urlunsplit

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent


def normalize_link(url):
    parts = urlsplit(unquote(url))
    if parts.scheme in ('http', 'https') and not parts.path:
        parts = parts._replace(path='/')
    return urlunsplit(parts)


def build():
    snapshot = json.loads(subprocess.check_output(['node', str(ROOT / 'scripts/pdf-snapshot.cjs')], cwd=ROOT, text=True))
    data = subprocess.check_output(['node', str(ROOT / 'scripts/render-pdf.cjs')],
                                   input=json.dumps(snapshot).encode(), cwd=ROOT)
    reader = PdfReader(io.BytesIO(data))
    text = '\n'.join(page.extract_text() or '' for page in reader.pages)
    if not 2 <= len(reader.pages) <= 10:
        raise ValueError(f'Unexpected page count: {len(reader.pages)}')
    compact = lambda value: re.sub(r'\s+', '', value)
    for expected in snapshot['headings'] + snapshot['blocks']:
        if compact(expected) not in compact(text):
            raise ValueError(f'Missing content in PDF: {expected}')
    if 'дата не указана' in text or 'даты не указаны' in text:
        raise ValueError('Unformatted dates found in PDF')
    links = {str(a.get_object().get('/A', {}).get('/URI', ''))
             for page in reader.pages for a in page.get('/Annots', [])}
    missing_links = {normalize_link(url) for url in snapshot['links']} - {normalize_link(url) for url in links}
    if missing_links:
        raise ValueError(f'Links missing from PDF: {missing_links}')
    out = ROOT / 'downloads/anton-bobkov-cv.pdf'
    out.parent.mkdir(exist_ok=True)
    out.write_bytes(data)
    html_path = ROOT / 'index.html'
    html = html_path.read_text()
    version = hashlib.sha256(data).hexdigest()[:12]
    html, count = re.subn(r'href="\./downloads/anton-bobkov-cv\.pdf(?:\?[^" ]*)?"',
                          f'href="./downloads/anton-bobkov-cv.pdf?v={version}"', html)
    if count != 1:
        raise ValueError('Download link not found or ambiguous')
    html_path.write_text(html)
    print(f'Generated {out.name}: {len(reader.pages)} A4 pages, {len(data)} bytes, {len(links)} link targets')


if __name__ == '__main__':
    build()
