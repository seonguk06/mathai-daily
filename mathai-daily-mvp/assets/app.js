/* MathAI Daily — dependency-free public front end. All feed content is escaped before rendering. */
(() => {
  'use strict';
  const API_PATH = 'data/news.json';
  const CATEGORIES = ['all', 'mathai', 'proof', 'math', 'ai'];
  const translations = {
    ko: {
      topline: 'THE DAILY SIGNAL FOR CURIOUS MINDS', timezone: 'SEOUL TIME, UTC+9',
      nav_latest: '오늘의 뉴스', nav_archive: '아카이브', nav_sources: '출처', nav_about: '소개',
      hero_eyebrow: 'THE INTELLIGENCE BRIEFING', hero_title: '수학의 다음 장면을<br>놓치지 않도록<span class="accent-dot">.</span>',
      hero_description: '새로운 증명부터 AI 연구의 돌파구까지. 넘쳐나는 정보 속에서 정말 중요한 변화만, 하나의 시야로.',
      explore: '오늘의 리서치 보기', how_it_works: '어떻게 만들었나요?',
      metric_stories: 'ARCHIVED STORIES', metric_sources: 'NEWS SOURCES', metric_languages: 'LANGUAGES',
      section_one: 'SECTION 01 — THE DAILY BRIEF', daily_brief: '오늘의 시그널<span class="heading-dot">.</span>',
      edition_label: 'EDITION', edition_loading: '데이터 불러오는 중...', time_kst: 'KST',
      daily_pulse: 'DAILY PULSE', editorial_note: 'EDITORIAL NOTE',
      editorial_note_text: '새로운 소식과 오래된 성과를 구분합니다. AI가 생성한 요약은 독립적인 사실 검증을 대체하지 않습니다.',
      methodology_link: '편집 원칙 살펴보기', section_two: 'SECTION 02 — THE RESEARCH FEED', research_feed: '리서치 피드<span class="heading-dot">.</span>',
      results_label: 'STORIES FOUND', search_placeholder: '키워드 검색', sort_recent: '최신순', sort_important: '중요도순', sort_oldest: '오래된순', saved: '저장됨',
      loading: '기사 데이터를 불러오는 중입니다...', section_three: 'SECTION 03 — OUR INPUTS', trusted_sources: '소식의 출발점<span class="heading-dot">.</span>',
      source_lede: '수학 커뮤니티, 연구 아카이브, AI 연구소의 공개 RSS·Atom 피드를 기반으로 합니다.',
      section_four: 'SECTION 04 — BEHIND THE BRIEF', about_title: '더 많은 정보가 아니라,<br>더 나은 맥락을.',
      about_description: 'MathAI Daily는 공개된 원문 메타데이터를 수집하고, 출처를 남기며, 한국어·영어로 쉽게 탐색할 수 있도록 구성한 오픈소스 뉴스 MVP입니다.',
      step_collect: '수집 / Collect', step_collect_desc: '공개 RSS와 arXiv Atom', step_curate: '분류 / Curate', step_curate_desc: '주제 분류와 중복 제거',
      step_publish: '공개 / Publish', step_publish_desc: '날짜별 아카이브',
      disclaimer: '주의: RSS 초록은 원문 전체가 아닙니다. AI 번역·요약이 활성화돼도 수학적 정확성과 논문의 검증 여부를 보장하지 않으며, 중요한 주장에는 반드시 원문과 후속 검증을 확인하세요.',
      footer_tagline: 'Mathematics meets intelligence. Curiosity stays human.', footer_independent: 'INDEPENDENT RESEARCH SIGNAL', back_top: 'BACK TO TOP ↑',
      cat_all: '전체', cat_mathai: 'AI × 수학', cat_proof: '형식 증명', cat_math: '수학', cat_ai: 'AI 연구',
      edition_all: '전체 기간', edition_yesterday: '어제 · {date}',
      status_demo: '시연용 아카이브 · 최초 자동 수집 전', status_live: '공개 데이터 수집 완료 · {count}건',
      updated: '마지막 수집', unknown_updated: '수집 기록 없음',
      feature_label: 'EDITOR’S PICK', feature_reason: '핵심 연구', read_more: '자세히 보기', source: '원문',
      pulse_demo: '시연 데이터', pulse_demo_desc: '화면 구성을 확인하기 위한 과거 실제 발표 사례입니다. 최신 뉴스가 아니며, GitHub Actions 첫 실행 후 실제 수집 결과로 교체됩니다.',
      pulse_zero: '어제 0건', pulse_zero_desc: '전날 게시된 항목을 아직 수집하지 못했습니다. 소식이 없거나 소스 업데이트가 지연됐을 수 있습니다.',
      pulse_count: '어제 {count}건', pulse_count_desc: '한국 시간 어제 공개된 기사와 논문 중 분류 기준에 부합하는 항목입니다.',
      pulse_coverage: '수집 소스 {ok}/{total}',
      no_feature: '선택 기간에 뉴스가 없습니다', no_feature_desc: '다른 날짜를 선택하거나 전체 아카이브를 살펴보세요.',
      empty_title: '아직 일치하는 기사가 없습니다', empty_desc: '검색어, 저장 항목, 주제 또는 날짜 필터를 변경해 보세요.', reset_filters: '필터 초기화',
      show_more: '기사 더 보기 ↓', end_of_feed: '모든 결과를 확인했습니다.',
      read_original: '원문 읽기 ↗', insight: 'RESEARCH CONTEXT', detail_impact: '왜 중요한가', detail_source: '출처 / 공개일',
      detail_notice: '해당 내용은 원문 RSS·Atom 메타데이터에 기반합니다. 자동 생성된 요약은 사실 검증이나 수학적 증명의 검증을 의미하지 않습니다.',
      translation_unavailable: '한국어 요약을 생성하려면 OPENAI_API_KEY를 설정하세요. 현재 영문 원문 요약이 표시됩니다.',
      data_error: '뉴스 데이터를 가져올 수 없습니다', data_error_detail: '로컬에서는 python3 -m http.server 8000 명령으로 실행하세요. 서버에서도 오류가 난다면 data/news.json을 확인하세요.',
      saved_toast: '저장했습니다', unsaved_toast: '저장을 취소했습니다',
      kind_paper: '논문', kind_article: '기사', kind_release: '연구 발표',
      source_type_rss: 'RSS FEED', source_type_atom: 'ARXIV ATOM',
    },
    en: {
      topline: 'THE DAILY SIGNAL FOR CURIOUS MINDS', timezone: 'SEOUL TIME, UTC+9',
      nav_latest: 'Latest', nav_archive: 'Archive', nav_sources: 'Sources', nav_about: 'About',
      hero_eyebrow: 'THE INTELLIGENCE BRIEFING', hero_title: 'Stay ahead of<br>what comes next<span class="accent-dot">.</span>',
      hero_description: 'From mathematical breakthroughs to the frontiers of AI. The research that matters, thoughtfully selected and clearly explained.',
      explore: 'Explore the research', how_it_works: 'How it works',
      metric_stories: 'ARCHIVED STORIES', metric_sources: 'NEWS SOURCES', metric_languages: 'LANGUAGES',
      section_one: 'SECTION 01 — THE DAILY BRIEF', daily_brief: 'The daily signal<span class="heading-dot">.</span>',
      edition_label: 'EDITION', edition_loading: 'Loading the feed...', time_kst: 'KST',
      daily_pulse: 'DAILY PULSE', editorial_note: 'EDITORIAL NOTE',
      editorial_note_text: 'We distinguish new reporting from past milestones. AI-generated summaries are not a substitute for independent verification.',
      methodology_link: 'Our editorial approach', section_two: 'SECTION 02 — THE RESEARCH FEED', research_feed: 'The research feed<span class="heading-dot">.</span>',
      results_label: 'STORIES FOUND', search_placeholder: 'Search research', sort_recent: 'Most recent', sort_important: 'Most relevant', sort_oldest: 'Oldest first', saved: 'Saved',
      loading: 'Loading articles...', section_three: 'SECTION 03 — OUR INPUTS', trusted_sources: 'Where we look<span class="heading-dot">.</span>',
      source_lede: 'Grounded in public RSS and Atom feeds from math communities, research archives, and AI laboratories.',
      section_four: 'SECTION 04 — BEHIND THE BRIEF', about_title: 'Not more information.<br>Better context.',
      about_description: 'MathAI Daily is an open-source news MVP that collects public source metadata, preserves attribution, and makes research easier to explore in Korean and English.',
      step_collect: 'Collect', step_collect_desc: 'Public RSS + arXiv Atom', step_curate: 'Curate', step_curate_desc: 'Topic tags + deduplication',
      step_publish: 'Publish', step_publish_desc: 'A searchable daily archive',
      disclaimer: 'Note: RSS abstracts are not full articles. Even with AI translations and summaries enabled, mathematical correctness and independent review are not guaranteed. Check original sources for consequential claims.',
      footer_tagline: 'Mathematics meets intelligence. Curiosity stays human.', footer_independent: 'INDEPENDENT RESEARCH SIGNAL', back_top: 'BACK TO TOP ↑',
      cat_all: 'All topics', cat_mathai: 'AI × Math', cat_proof: 'Formal proof', cat_math: 'Mathematics', cat_ai: 'AI research',
      edition_all: 'All editions', edition_yesterday: 'Yesterday · {date}',
      status_demo: 'Preview archive · awaiting first live sync', status_live: 'Public feeds synced · {count} stories',
      updated: 'Last synced', unknown_updated: 'Never synced',
      feature_label: 'EDITOR’S PICK', feature_reason: 'Featured research', read_more: 'Read the context', source: 'Source',
      pulse_demo: 'Preview content', pulse_demo_desc: 'These are real historical announcements for previewing the interface, not current news. The first GitHub Actions update replaces them with collected items.',
      pulse_zero: '0 yesterday', pulse_zero_desc: 'No qualifying items from the previous Seoul calendar day were found. Feeds may also be delayed.',
      pulse_count: '{count} yesterday', pulse_count_desc: 'Items published yesterday in Seoul time that meet our editorial topic rules.',
      pulse_coverage: 'Feeds reached {ok}/{total}',
      no_feature: 'No stories in this edition', no_feature_desc: 'Select another date or browse the full archive.',
      empty_title: 'No matching research stories', empty_desc: 'Try clearing your search, saved-only mode, topic, or date filter.', reset_filters: 'Clear filters',
      show_more: 'Load more stories ↓', end_of_feed: 'You have reached the end of the feed.',
      read_original: 'Read original ↗', insight: 'RESEARCH CONTEXT', detail_impact: 'Why it matters', detail_source: 'Source / Published',
      detail_notice: 'Based on source RSS/Atom metadata. Automatically produced summaries are not independently fact-checked and do not constitute verification of a mathematical proof.',
      translation_unavailable: 'Set OPENAI_API_KEY to generate Korean summaries. The original English abstract is shown for now.',
      data_error: 'Unable to load the news feed', data_error_detail: 'For local preview, run python3 -m http.server 8000. If deployed, check data/news.json.',
      saved_toast: 'Saved to this browser', unsaved_toast: 'Removed from saved',
      kind_paper: 'Paper', kind_article: 'Article', kind_release: 'Research news',
      source_type_rss: 'RSS FEED', source_type_atom: 'ARXIV ATOM',
    },
  };
  const state = {
    lang: getStored('mathai-lang', 'ko') === 'en' ? 'en' : 'ko',
    theme: getStored('mathai-theme', 'dark') === 'light' ? 'light' : 'dark',
    articles: [], sources: [], meta: {},
    category: 'all', edition: 'all', sort: 'recent', query: '', savedOnly: false,
    saved: new Set(readSaved()), limit: 9,
  };
  let toastTimer;
  const $ = id => document.getElementById(id);
  const htmlSafe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = url => { try { const parsed = new URL(url); return parsed.protocol === 'https:' ? parsed.href : '#'; } catch { return '#'; } };
  const locale = () => state.lang === 'ko' ? 'ko-KR' : 'en-US';
  const t = (key, variables={}) => (translations[state.lang][key] || key).replace(/\{(\w+)\}/g,(_,k)=>String(variables[k]??''));
  function getStored(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }
  function setStored(key, value) { try { localStorage.setItem(key,value); } catch { /* private browsing */ } }
  function readSaved() { try { const v = JSON.parse(getStored('mathai-bookmarks', '[]')); return Array.isArray(v) ? v.filter(x=>typeof x==='string') : []; } catch { return []; } }
  function localized(field) { return typeof field === 'string' ? field : (field?.[state.lang] || field?.en || field?.ko || ''); }
  function kstDate(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'unknown';
    const p = new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
    const byType = x => p.find(v=>v.type===x)?.value;
    return `${byType('year')}-${byType('month')}-${byType('day')}`;
  }
  function kstYesterday() { return kstDate(Date.now() - 24*3600*1000); }
  function prettyDate(iso, opts={month:'short',day:'numeric',year:'numeric'}) {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '—' : new Intl.DateTimeFormat(locale(),{timeZone:'Asia/Seoul',...opts}).format(d);
  }
  function dateLabel(day) { const [y,m,d] = day.split('-'); return state.lang==='ko' ? `${y}.${m}.${d}` : `${m}/${d}/${y}`; }
  function copyYear() { $('copyright-year').textContent = String(new Date().getFullYear()); }
  function sourceMark(name) { return String(name||'?').trim().slice(0,1).toUpperCase(); }
  function showToast(message) { const toast=$('toast'); toast.textContent=message; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('visible'),2300); }
  function setStaticLanguage() {
    document.documentElement.lang=state.lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    document.querySelectorAll('[data-i18n-html]').forEach(el=>{el.innerHTML=t(el.dataset.i18nHtml);});
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder);});
    for (const code of ['ko','en']) { const selected = state.lang===code; $('lang-'+code).classList.toggle('selected',selected); $('lang-'+code).setAttribute('aria-pressed',String(selected)); }
    document.title = state.lang==='ko'?'MathAI Daily — 수학과 AI의 새로운 발견':'MathAI Daily — Mathematics meets intelligence';
    $('topline-date').textContent=prettyDate(new Date().toISOString(),{month:'short',day:'numeric',year:'numeric'}).toUpperCase();
    document.body.dataset.theme=state.theme;
  }
  function articleById(id) { return state.articles.find(a=>a.id===id); }
  function renderTabs() {
    $('category-tabs').innerHTML=CATEGORIES.map(category=>`<button type="button" class="category-tab ${state.category===category?'selected':''}" data-action="category" data-value="${category}" aria-pressed="${state.category===category}">${htmlSafe(t('cat_'+category))}</button>`).join('');
  }
  function renderEditions() {
    const days=[...new Set(state.articles.map(x=>kstDate(x.publishedAt)).filter(x=>x!=='unknown'))].sort().reverse();
    const yesterday=kstYesterday();
    const select=$('edition-select');
    const options=[{value:'all',text:t('edition_all')},{value:'yesterday',text:t('edition_yesterday',{date:dateLabel(yesterday)})},...days.filter(x=>x!==yesterday).map(d=>({value:d,text:dateLabel(d)}))];
    if(!options.some(x=>x.value===state.edition)) state.edition='all';
    select.innerHTML=options.map(x=>`<option value="${htmlSafe(x.value)}">${htmlSafe(x.text)}</option>`).join('');
    select.value=state.edition;
  }
  function dateMatch(item) { if(state.edition==='all') return true; return kstDate(item.publishedAt)===(state.edition==='yesterday'?kstYesterday():state.edition); }
  function visibleItems() {
    const q=state.query.trim().toLocaleLowerCase();
    return state.articles.filter(a => dateMatch(a) && (state.category==='all'||a.category===state.category) &&
      (!state.savedOnly||state.saved.has(a.id)) && (!q||[a.source,a.category,a.title?.ko,a.title?.en,a.summary?.ko,a.summary?.en,a.impact?.ko,a.impact?.en].join(' ').toLocaleLowerCase().includes(q)))
      .sort((a,b)=>state.sort==='important' ? (b.score||0)-(a.score||0) || new Date(b.publishedAt)-new Date(a.publishedAt) : (state.sort==='oldest'?1:-1)*(new Date(a.publishedAt)-new Date(b.publishedAt)));
  }
  function displayText(field,article) {
    if(state.lang==='ko' && article.languageQuality==='source-only') return localized(field) || '';
    return localized(field);
  }
  function cardTemplate(a) {
    const isSaved=state.saved.has(a.id);
    const title=displayText(a.title,a);
    const summary=displayText(a.summary,a);
    return `<article class="story-card cat-${htmlSafe(a.category)}">
      <div class="story-card-top"><span class="story-category">${htmlSafe(t('cat_'+a.category))} <span aria-hidden="true">/</span> ${htmlSafe(t('kind_'+a.kind))}${a.languageQuality==='source-only'?' · EN ORIGINAL':''}</span><button class="story-save ${isSaved?'saved':''}" type="button" data-action="save" data-id="${htmlSafe(a.id)}" title="${htmlSafe(t('saved'))}" aria-label="${htmlSafe(t('saved'))}" aria-pressed="${isSaved}">${isSaved?'★':'☆'}</button></div>
      <h3 class="story-title"><button type="button" data-action="detail" data-id="${htmlSafe(a.id)}">${htmlSafe(title)}</button></h3>
      <p class="story-summary">${htmlSafe(summary)}</p>
      <div class="story-card-bottom"><div class="source-group"><span class="source-icon" aria-hidden="true">${htmlSafe(sourceMark(a.source))}</span><span class="source-name">${htmlSafe(a.source)}</span></div><time class="story-date" datetime="${htmlSafe(a.publishedAt)}">${htmlSafe(prettyDate(a.publishedAt,{month:'short',day:'numeric'}))}</time></div>
      <a class="story-open" href="${htmlSafe(safeUrl(a.url))}" target="_blank" rel="noopener noreferrer">${htmlSafe(t('read_original'))}</a>
    </article>`;
  }
  function renderFeatured() {
    const list=visibleItems().slice().sort((a,b)=>(b.score||0)-(a.score||0)||new Date(b.publishedAt)-new Date(a.publishedAt));
    const feature=list[0];
    if(!feature) {
      $('featured-container').innerHTML=`<div class="featured-empty"><span class="empty-icon">∅</span><strong>${htmlSafe(t('no_feature'))}</strong><p>${htmlSafe(t('no_feature_desc'))}</p></div>`;
      return;
    }
    $('featured-container').innerHTML=`<article class="featured-card"><div class="featured-top"><span class="featured-tag"><span class="tag-star">✳</span>${htmlSafe(t('feature_label'))}</span><span class="featured-count">01 / ${String(list.length).padStart(2,'0')}</span></div>
      <div class="featured-inner"><div class="featured-eyebrow">${htmlSafe(t('cat_'+feature.category))} &nbsp;·&nbsp; ${htmlSafe(t('kind_'+feature.kind))}${feature.languageQuality==='source-only'?' &nbsp;·&nbsp; EN ORIGINAL':''}</div><h3 class="featured-title">${htmlSafe(displayText(feature.title,feature))}</h3><p class="featured-summary">${htmlSafe(displayText(feature.summary,feature))}</p></div>
      <div class="featured-bottom"><div class="featured-source"><span class="source-icon">${htmlSafe(sourceMark(feature.source))}</span><span>${htmlSafe(feature.source)} · ${htmlSafe(prettyDate(feature.publishedAt))}</span></div><button class="round-next" type="button" data-action="detail" data-id="${htmlSafe(feature.id)}" aria-label="${htmlSafe(t('read_more'))}">↗</button></div>
    </article>`;
  }
  function renderPulse() {
    const yesterday=kstYesterday();
    const items=state.articles.filter(a=>kstDate(a.publishedAt)===yesterday);
    const demo=!!state.meta.demo;
    $('pulse-heading').textContent=demo?t('pulse_demo'):items.length?t('pulse_count',{count:items.length}):t('pulse_zero');
    $('pulse-description').textContent=demo?t('pulse_demo_desc'):items.length?t('pulse_count_desc'):t('pulse_zero_desc');
    const categoryCounts={};
    items.forEach(a=>categoryCounts[a.category]=(categoryCounts[a.category]||0)+1);
    const tags=Object.entries(categoryCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c,n])=>`${t('cat_'+c)} · ${n}`);
    if(!tags.length) tags.push(t('pulse_coverage',{ok:state.meta.health?.ok??0,total:state.sources.length}));
    $('pulse-tags').innerHTML=tags.map(x=>`<span class="pulse-tag">${htmlSafe(x)}</span>`).join('');
    $('edition-status').textContent=demo?t('status_demo'):t('status_live',{count:state.articles.length});
    $('last-updated').textContent=state.meta.generatedAt ? `${t('updated')}: ${prettyDate(state.meta.generatedAt,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}` : t('unknown_updated');
  }
  function renderSourceList() {
    const counts=new Map();state.articles.forEach(a=>counts.set(a.source,(counts.get(a.source)||0)+1));
    $('sources-list').innerHTML=state.sources.map(s=>{
      return `<a class="source-card" href="${htmlSafe(safeUrl(s.homepage))}" rel="noopener noreferrer" target="_blank"><span class="source-symbol" aria-hidden="true">${htmlSafe(s.symbol||sourceMark(s.name))}</span><span class="source-label"><strong>${htmlSafe(s.name)}</strong><small>${htmlSafe(t(s.type==='atom'?'source_type_atom':'source_type_rss'))} · ${counts.get(s.name)||0} ${state.lang==='ko'?'기사':'stories'}</small></span><span class="source-link" aria-hidden="true">↗</span></a>`;
    }).join('');
  }
  function renderStories() {
    const items=visibleItems();
    $('results-count').textContent=String(items.length);
    $('saved-only').classList.toggle('selected',state.savedOnly);
    $('saved-only').setAttribute('aria-pressed',String(state.savedOnly));
    $('sort-select').value=state.sort;
    if(items.length===0) {
      $('stories-grid').innerHTML=`<div class="empty-card"><span class="empty-icon">∅</span><strong>${htmlSafe(t('empty_title'))}</strong><p>${htmlSafe(t('empty_desc'))}</p><button type="button" data-action="reset">${htmlSafe(t('reset_filters'))}</button></div>`;
      $('feed-bottom').innerHTML=''; return;
    }
    $('stories-grid').innerHTML=items.slice(0,state.limit).map(cardTemplate).join('');
    $('feed-bottom').innerHTML=items.length>state.limit?`<button class="load-more" type="button" data-action="more">${htmlSafe(t('show_more'))} (${Math.min(items.length-state.limit,9)})</button>`:`<span class="end-note">✳ ${htmlSafe(t('end_of_feed'))}</span>`;
  }
  function renderEverything() { setStaticLanguage();renderTabs();renderEditions();renderPulse();renderFeatured();renderStories();renderSourceList(); }
  function showDetail(id) {
    const a=articleById(id); if(!a)return;
    $('dialog-body').innerHTML=`<div class="dialog-kicker">${htmlSafe(t('cat_'+a.category))} &nbsp;/&nbsp; ${htmlSafe(t('kind_'+a.kind))}</div><h3 id="dialog-title" class="dialog-title">${htmlSafe(displayText(a.title,a))}</h3><p class="dialog-intro">${htmlSafe(displayText(a.summary,a))}</p>
      <div class="dialog-section"><h4>${htmlSafe(t('detail_impact'))}</h4><p>${htmlSafe(displayText(a.impact,a)||t('detail_notice'))}</p></div>
      <div class="dialog-source-row"><span>${htmlSafe(a.source)} · ${htmlSafe(prettyDate(a.publishedAt))}</span><a class="dialog-visit" href="${htmlSafe(safeUrl(a.url))}" target="_blank" rel="noopener noreferrer">${htmlSafe(t('read_original'))}</a></div>
      <div class="dialog-note">${htmlSafe(t('detail_notice'))}</div>`;
    const dialog=$('story-dialog'); if(typeof dialog.showModal==='function')dialog.showModal();
  }
  function resetFilters() { state.query='';state.category='all';state.edition='all';state.savedOnly=false;state.sort='recent';state.limit=9;$('search-input').value='';renderEverything(); }
  function wireInteractions() {
    $('lang-ko').addEventListener('click',()=>{state.lang='ko';setStored('mathai-lang','ko');renderEverything();});
    $('lang-en').addEventListener('click',()=>{state.lang='en';setStored('mathai-lang','en');renderEverything();});
    $('theme-toggle').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';setStored('mathai-theme',state.theme);document.body.dataset.theme=state.theme;});
    $('edition-select').addEventListener('change',e=>{state.edition=e.target.value;state.limit=9;renderFeatured();renderStories();});
    $('sort-select').addEventListener('change',e=>{state.sort=e.target.value;renderFeatured();renderStories();});
    $('search-input').addEventListener('input',e=>{state.query=e.target.value;state.limit=9;renderFeatured();renderStories();});
    $('saved-only').addEventListener('click',()=>{state.savedOnly=!state.savedOnly;renderFeatured();renderStories();});
    $('dialog-close').addEventListener('click',()=>$('story-dialog').close());
    $('story-dialog').addEventListener('click',e=>{if(e.target===$('story-dialog'))$('story-dialog').close();});
    document.addEventListener('click',e=>{
      const btn=e.target.closest('[data-action]'); if(!btn)return;
      const action=btn.dataset.action;
      if(action==='category') { state.category=btn.dataset.value;state.limit=9;renderTabs();renderFeatured();renderStories(); }
      if(action==='detail')showDetail(btn.dataset.id);
      if(action==='more') {state.limit+=9;renderStories();}
      if(action==='reset')resetFilters();
      if(action==='save') {
        if(state.saved.has(btn.dataset.id)){state.saved.delete(btn.dataset.id);showToast(t('unsaved_toast'));}
        else {state.saved.add(btn.dataset.id);showToast(t('saved_toast'));}
        setStored('mathai-bookmarks',JSON.stringify([...state.saved]));renderStories();renderFeatured();
      }
    });
    document.addEventListener('keydown',e=>{
      const el=document.activeElement;
      if(e.key==='/' && el?.tagName!=='INPUT' && el?.tagName!=='TEXTAREA' && !$('story-dialog').open){e.preventDefault();$('search-input').focus();}
    });
  }
  async function load() {
    try {
      const response=await fetch(API_PATH,{cache:'no-cache'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const json=await response.json();
      if(!Array.isArray(json.articles)||!Array.isArray(json.sources))throw new Error('Invalid feed format');
      state.articles=json.articles.filter(x=>x?.id&&x?.title&&x?.url&&safeUrl(x.url)!=='#'&&Number.isFinite(Date.parse(x.publishedAt)));
      state.sources=json.sources;
      state.meta=json;
      $('metric-stories').textContent=state.articles.length.toLocaleString(locale());
      $('metric-sources').textContent=String(state.sources.length);
      renderEverything();
    } catch(err) {
      console.error('MathAI Daily: failed to load the feed:',err);
      $('edition-status').textContent=t('data_error');
      $('featured-container').innerHTML=`<div class="featured-empty"><span class="empty-icon">!</span><strong>${htmlSafe(t('data_error'))}</strong><p>${htmlSafe(t('data_error_detail'))}</p></div>`;
      $('stories-grid').innerHTML=`<div class="empty-card"><strong>${htmlSafe(t('data_error'))}</strong><p>${htmlSafe(t('data_error_detail'))}</p></div>`;
    }
  }
  copyYear(); setStaticLanguage(); wireInteractions(); load();
})();
