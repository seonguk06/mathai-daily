"""Offline smoke tests for feed parsing, deduplication, KST dates, and publication."""
import json
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from update_news import (parse_feed,normalize_url,parse_date,make_new_articles,
                         classify,run,kst_date,finalize_archive)
from check_data import check

FIXTURES=ROOT/'tests'/'fixtures'
SOURCES={s['name']:s for s in json.loads((ROOT/'data'/'sources.json').read_text())}
NOW=datetime(2026,10,18,3,0,tzinfo=timezone.utc)


class FeedPipelineTests(unittest.TestCase):
    def test_rss_parsing(self):
        rows=parse_feed((FIXTURES/'sample_rss.xml').read_bytes(),SOURCES['Quanta Magazine'])
        self.assertEqual(len(rows),2)
        self.assertEqual(rows[0]['url'],'https://example.org/ai-theorem')
        self.assertIn('neural network',rows[0]['excerpt'])
        self.assertEqual(rows[0]['publishedAt'],'2026-10-17T10:15:00Z')

    def test_atom_parsing(self):
        rows=parse_feed((FIXTURES/'sample_atom.xml').read_bytes(),SOURCES['arXiv'])
        self.assertEqual(rows[0]['url'],'https://arxiv.org/abs/2610.12345')
        self.assertEqual(rows[0]['kind'],'paper')

    def test_korean_calendar_day_boundary(self):
        self.assertEqual(str(kst_date('2026-10-16T16:00:00Z')),'2026-10-17')
        self.assertEqual(str(kst_date('2026-10-17T14:59:59Z')),'2026-10-17')
        self.assertEqual(str(kst_date('2026-10-17T15:00:00Z')),'2026-10-18')

    def test_topic_classification_and_dedup(self):
        rows=parse_feed((FIXTURES/'sample_rss.xml').read_bytes(),SOURCES['Quanta Magazine'])
        self.assertEqual(classify(rows[0]['title'],rows[0]['excerpt'],SOURCES['Quanta Magazine'])[0],'mathai')
        self.assertIsNone(classify(rows[1]['title'],rows[1]['excerpt'],SOURCES['Quanta Magazine']))
        merged=make_new_articles([(rows[0],SOURCES['Quanta Magazine'])]*2,NOW,3,[])
        self.assertEqual(len(merged),1)

    def test_standalone_ai_keyword_is_recognized(self):
        category=classify('AI helps explore deep theorems', 'Using neural methods', SOURCES['Quanta Magazine'])
        self.assertIsNotNone(category)
        self.assertEqual(category[0], 'mathai')

    def test_date_parser(self):
        self.assertEqual(parse_date('Sat, 17 Oct 2026 10:15:00 GMT').year,2026)
        self.assertEqual(normalize_url('javascript:alert(1)'),'')
        self.assertEqual(normalize_url('https://example.org/a?utm_campaign=x&n=1'), 'https://example.org/a?n=1')

    def test_archive_preserves_existing_translation(self):
        rows=parse_feed((FIXTURES/'sample_rss.xml').read_bytes(),SOURCES['Quanta Magazine'])
        new=make_new_articles([(rows[0],SOURCES['Quanta Magazine'])],NOW,4,[])
        old={**new[0], 'title':{'ko':'옛 번역','en':new[0]['title']['en']}}
        result=finalize_archive(new,[old],NOW)
        self.assertEqual(result[0]['title']['ko'],'옛 번역')

    def test_end_to_end_offline(self):
        with tempfile.TemporaryDirectory() as d:
            dst=Path(d)/'news.json'
            data=run(dst,NOW,3,FIXTURES)
            self.assertFalse(data['demo'])
            self.assertEqual(data['health']['ok'],2)
            self.assertEqual(len(data['articles']),2)
            check(json.loads(dst.read_text()))

if __name__=='__main__':
    unittest.main()
