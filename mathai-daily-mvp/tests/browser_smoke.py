"""Optional browser smoke test using injected static files (no network required).

Requires playwright + local Chromium. Used for QA; not required to host the site.
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text().replace('<link rel="stylesheet" href="assets/styles.css">','').replace('<script src="assets/app.js" defer></script>','')
CSS=(ROOT/'assets/styles.css').read_text()
JS=(ROOT/'assets/app.js').read_text()
NEWS=json.loads((ROOT/'data/news.json').read_text())
FETCH_MOCK='window.fetch = () => Promise.resolve({ok: true, json: () => Promise.resolve('+json.dumps(NEWS,ensure_ascii=False)+')});\n'


def load(page):
    page.set_content(HTML, wait_until='domcontentloaded')
    page.add_style_tag(content=CSS)
    page.add_script_tag(content=FETCH_MOCK+JS)
    page.locator('.story-card').first.wait_for()

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    load(page)
    assert page.locator('.story-card').count()==9, f"cards={page.locator('.story-card').count()}"
    assert 'MathAI Daily' in page.title()
    page.screenshot(path='/mnt/data/mathai-daily-preview-desktop.png',full_page=True)
    page.locator('#lang-en').click()
    assert 'Stay ahead' in page.locator('h1').inner_text()
    page.locator('#search-input').fill('Alpha')
    count=page.locator('.story-card').count()
    assert count>=1 and count<9, f'bad search cards {count}'
    page.locator('#search-input').fill('')
    page.locator('[data-action=category][data-value=math]').click()
    assert page.locator('.story-card').count()==2
    page.locator('[data-action=category][data-value=all]').click()
    page.locator('.story-save').first.click()
    page.locator('#saved-only').click()
    assert page.locator('.story-card').count()==1
    page.locator('.story-title button').click()
    assert page.locator('#story-dialog').evaluate('(el)=>el.open') is True
    page.locator('#dialog-close').click()
    page.locator('#theme-toggle').click()
    assert page.locator('body').get_attribute('data-theme')=='light'
    assert not errors, 'browser errors '+str(errors)
    mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1, is_mobile=True, has_touch=True)
    mobile.on('pageerror',lambda e: errors.append(str(e)))
    load(mobile)
    mobile.screenshot(path='/mnt/data/mathai-daily-preview-mobile.png',full_page=True)
    scroll=mobile.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})')
    print('mobile overflow:',scroll)
    assert scroll['scroll'] <= scroll['client']+2, f'mobile horizontal overflow: {scroll}'
    assert not errors,errors
    print('BROWSER QA PASSED: language, search, filters, saved, modal, theme, responsive')
    browser.close()
