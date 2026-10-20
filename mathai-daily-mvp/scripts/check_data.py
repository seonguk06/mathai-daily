#!/usr/bin/env python3
"""Validate the public JSON feed before deployment (no third-party dependencies)."""
import json
import sys
from pathlib import Path
from datetime import datetime
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / 'data' / 'news.json'


def check(document: dict) -> None:
    assert document.get('schemaVersion') == 1, 'unexpected schema version'
    assert isinstance(document.get('demo'), bool), 'demo must be boolean'
    assert isinstance(document.get('sources'), list) and document['sources'], 'missing sources'
    assert isinstance(document.get('articles'), list), 'articles must be list'
    names = {s['name'] for s in document['sources']}
    ids=set()
    for index,a in enumerate(document['articles']):
        prefix = f'article #{index}'
        assert a.get('id') and a['id'] not in ids, prefix+' duplicate/missing ID'
        ids.add(a['id'])
        assert a.get('source') in names, prefix+' unknown source'
        assert urlsplit(a.get('url','')).scheme == 'https', prefix+' URL must be HTTPS'
        assert a.get('category') in ('mathai','proof','math','ai'), prefix+' bad category'
        assert a.get('kind') in ('paper','article','release'), prefix+' bad kind'
        assert 0<=a.get('score',-1)<=100, prefix+' invalid score'
        assert a.get('languageQuality') in ('editorial','ai','source-only'), prefix+' invalid translation status'
        datetime.fromisoformat(a['publishedAt'].replace('Z','+00:00'))
        for field in ('title','summary','impact'):
            assert isinstance(a.get(field),dict),prefix+' missing '+field
            for lang in ('ko','en'):
                assert isinstance(a[field].get(lang),str) and a[field][lang].strip(),prefix+' missing '+field+'.'+lang
    print(f"Valid JSON: {len(document['articles'])} articles, {len(document['sources'])} sources, demo={document['demo']}")


if __name__=='__main__':
    try:
        check(json.loads(PATH.read_text(encoding='utf-8')))
    except Exception as error:
        print(f'INVALID FEED: {error}',file=sys.stderr)
        raise SystemExit(1)
