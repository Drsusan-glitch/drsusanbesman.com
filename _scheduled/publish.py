"""Publish scheduled blog posts whose date has arrived.

Run from the repository root (the GitHub Action does this every Monday).
Each entry in _scheduled/posts.json is published once, on or after its date
(Eastern time). Already-published posts are skipped, so it is safe to re-run.

To change the schedule: edit the dates in _scheduled/posts.json.
To cancel a post: delete its entry from _scheduled/posts.json.
To edit a post before it goes live: edit _scheduled/posts/<slug>.html.
Test without changing anything: FAKE_DATE=2026-12-07 python3 _scheduled/publish.py --dry-run
"""
import json, re, sys, os, html, xml.dom.minidom
from datetime import datetime, timezone, timedelta

def add_post(c):

    slug, title, desc, sub = c['slug'], c['title'], c['desc'], c['sub']
    img, iw, ih, cat = c['img'], c['img_w'], c['img_h'], c['category']
    d = datetime.strptime(c['date'], '%Y-%m-%d')
    date_iso, date_h = c['date'], d.strftime('%B %-d, %Y')
    body = open(c['body']).read().strip()
    url = f'https://drsusanbesman.com/blog/{slug}/'

    # ---- find current featured post (template) ----
    bi = open('blog/index.html').read()
    fm = re.search(r'<a class="feat" href="\.\./blog/([^/]+)/"><img src="\.\./assets/([^"]+)"[^>]*><div><div class="eyebrow"[^>]*>Latest · ([^<]+)</div><h2>([^<]+)</h2>', bi)
    prev_slug, prev_img, prev_cat, prev_title = fm.groups()
    tpl = open(f'blog/{prev_slug}/index.html').read()

    # ---- head + structured data ----
    def meta(name, s):
        return re.search(name, s).group(1)
    prev_desc = meta(r'<meta name="description" content="([^"]*)"', tpl)
    s = tpl.replace(prev_title, title).replace(prev_desc, desc)
    s = s.replace(f'https://drsusanbesman.com/blog/{prev_slug}/', url)
    s = s.replace(f'assets/{prev_img}', f'assets/{img}')
    # search-engine title (kept under 60 characters so Google shows it in full)
    seo = html.escape(c.get('seo_title') or title, quote=False)
    s = re.sub(r'<title>.*?</title>', f'<title>{seo}</title>', s, count=1)
    s = re.sub(r'(property="og:title" content=")[^"]*', lambda m: m.group(1) + seo, s, count=1)
    s = re.sub(r'"datePublished":"[^"]*","dateModified":"[^"]*"', f'"datePublished":"{date_iso}","dateModified":"{date_iso}"', s)
    main = re.search(r'<main>.*?</main>', s, re.S).group(0)
    tail = main[main.index('<div class="med">'):]
    hero = ('<main>\n<section class="hero"><div class="wrap narrow"><div class="crumbs"><a href="../../">Home</a> / <a href="../../blog/">Blog</a> / ' + cat + '</div>'
            f'<div class="eyebrow">{cat}</div><h1>{title}</h1><p>{sub}</p><p class="post-meta" style="font-size:15px;margin:0">By Dr. Susan Besman, Ph.D., LMFT · {date_h}</p></div></section>\n'
            f'<section class="section"><article class="post wrap narrow"><img class="postimg" src="../../assets/{img}" alt="" width="{iw}" height="{ih}">')
    s = s.replace(main, hero + body + tail)
    if c.get('related_html'):  # swap the "Related service" box
        s = re.sub(r'<div class="med">.*?</div>', '<div class="med">' + c['related_html'] + '</div>', s, count=1, flags=re.S)
    assert prev_title not in s, 'template title left over'
    os.makedirs(f'blog/{slug}', exist_ok=True)
    open(f'blog/{slug}/index.html', 'w').write(s)

    # ---- blog index ----
    feat = re.search(r'<a class="feat" href="\.\./blog/[^"]+">.*?</a>', bi, re.S).group(0)
    newfeat = (f'<a class="feat" href="../blog/{slug}/"><img src="../assets/{img}" alt="" width="{iw}" height="{ih}"><div><div class="eyebrow" style="margin-bottom:10px">Latest · {cat}</div>'
               f'<h2>{title}</h2><p>{sub}</p><span class="more">Read article →</span></div></a>')
    prev_sub = re.search(r'<h2>' + re.escape(prev_title) + r'</h2><p>([^<]*)</p>', bi).group(1)
    oldcard = (f'<a class="card" href="../blog/{prev_slug}/"><img src="../assets/{prev_img}" alt="" width="600" height="400" loading="lazy"><div class="eyebrow" style="margin-bottom:8px">{prev_cat}</div>'
               f'<h3>{prev_title}</h3><span class="more">Read article →</span></a>')
    bi = bi.replace(feat, newfeat, 1).replace('<div class="cards"><a class="card"', '<div class="cards">' + oldcard + '<a class="card"', 1)
    open('blog/index.html', 'w').write(bi)

    # ---- homepage journal: newest 3 ----
    h = open('index.html').read()
    sec = re.search(r'(<div class="eyebrow">The Journal</div>.*?<div class="cards">)(.*?)(</div>\s*(?:<div class="soon"|</div>\s*</section>))', h, re.S)
    cards = re.findall(r'<a class="card" href="blog/.*?</a>', sec.group(2), re.S)
    newcard = (f'<a class="card" href="blog/{slug}/"><img src="assets/{img}" alt="" width="600" height="400" loading="lazy"><div class="eyebrow" style="margin-bottom:8px">{cat}</div>'
               f'<h3>{title}</h3><span class="more">Read article →</span></a>')
    h = h.replace(sec.group(2), ''.join([newcard] + cards[:2]), 1)
    open('index.html', 'w').write(h)

    # ---- sitemap ----
    sm = open('sitemap.xml').read()
    sm = sm.replace('  <url><loc>https://drsusanbesman.com/blog/</loc>', f'  <url><loc>https://drsusanbesman.com/blog/</loc>', 1)
    entry = f'  <url><loc>{url}</loc><lastmod>{date_iso}</lastmod><priority>0.7</priority></url>\n'
    sm = re.sub(r'(  <url><loc>https://drsusanbesman.com/blog/</loc>[^\n]*\n)', lambda m: m.group(1) + entry, sm, count=1)
    for page in ['https://drsusanbesman.com/', 'https://drsusanbesman.com/blog/']:
        sm = re.sub(r'(<loc>' + re.escape(page) + r'</loc><lastmod>)[^<]*', r'\g<1>' + date_iso, sm)
    open('sitemap.xml', 'w').write(sm)

    # ---- feed ----
    fd = open('feed.xml').read()
    rfc = d.strftime('%a, %d %b %Y') + ' 09:00:00 -0500'
    item = f'''  <item>
        <title>{title}</title>
        <link>{url}</link>
        <guid isPermaLink="true">{url}</guid>
        <pubDate>{rfc}</pubDate>
        <dc:creator>Dr. Susan Besman, Ph.D., LMFT</dc:creator>
        <description>{desc}</description>
        <enclosure url="https://drsusanbesman.com/assets/{img}" type="image/jpeg" length="0"/>
        <media:content url="https://drsusanbesman.com/assets/{img}" medium="image"/>
      </item>
    '''
    fd = fd.replace('  <item>', item + '  <item>', 1)
    fd = re.sub(r'<lastBuildDate>[^<]*</lastBuildDate>', f'<lastBuildDate>{rfc}</lastBuildDate>', fd)
    open('feed.xml', 'w').write(fd)
    xml.dom.minidom.parse('feed.xml'); xml.dom.minidom.parse('sitemap.xml')
    print('  published', slug, '| previous featured:', prev_slug, '| homepage cards:', len(cards[:2]) + 1)


def add_reading(service, slug, title, limit=5):
    """Put a link to a blog post at the top of a service page's "Helpful reading" list."""
    path = f'services/{service}/index.html'
    if not os.path.exists(path):
        return
    s = open(path).read()
    if f'blog/{slug}/' in s:
        return
    li = f'<li><a href="../../blog/{slug}/">{title}</a></li>'
    m = re.search(r'<h2>Helpful reading</h2><ul>(.*?)</ul>', s, re.S)
    if m:
        items = re.findall(r'<li>.*?</li>', m.group(1), re.S)
        s = s.replace(m.group(0), '<h2>Helpful reading</h2><ul>' + ''.join([li] + items[:limit - 1]) + '</ul>', 1)
    else:
        anchor = '<div style="margin-top:56px"><div class="meet">'
        if anchor not in s:
            return
        s = s.replace(anchor, f'<h2>Helpful reading</h2><ul>{li}</ul>' + anchor, 1)
    open(path, 'w').write(s)


def today_eastern():
    if os.environ.get('FAKE_DATE'):
        return os.environ['FAKE_DATE']
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo('America/New_York')).strftime('%Y-%m-%d')
    except Exception:
        return (datetime.now(timezone.utc) - timedelta(hours=5)).strftime('%Y-%m-%d')

if __name__ == '__main__':
    today = today_eastern()
    due = [c for c in json.load(open('_scheduled/posts.json'))
           if c['date'] <= today and not os.path.exists(f"blog/{c['slug']}/index.html")]
    due.sort(key=lambda c: c['date'])
    print(f'Today (Eastern): {today}. Posts due: {len(due)}')
    for c in due:
        print(' -', c['date'], c['slug'])
        if '--dry-run' not in sys.argv:
            add_post(c)
            m = re.search(r'services/([^/]+)/', c.get('related_html', ''))
            if m:
                add_reading(m.group(1), c['slug'], c['title'])
