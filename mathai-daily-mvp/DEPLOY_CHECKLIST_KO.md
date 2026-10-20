# MathAI Daily — 설치 및 배포 5분 체크리스트

## A. 내 컴퓨터에서 실행

1. Python 3.10 이상 설치 (`python3 --version` 또는 Windows의 `py --version`).
2. 압축 해제한 `mathai-daily-mvp` 폴더를 터미널에서 열기.
3. `python3 -m http.server 8000` 실행 (Windows에서는 `py -m http.server 8000`).
4. 브라우저에서 **http://localhost:8000** 접속.

처음에 보이는 기사 9개는 **과거 발표 사례로 이루어진 시연 데이터**입니다.

## B. 최신 뉴스를 바로 가져오기

```bash
python3 scripts/update_news.py --days 14
python3 scripts/check_data.py
```

인터넷 연결이 필요합니다. OpenAI API 키가 없다면 원문 영문 제목·초록을 표시하고, 한국어 UI는 그대로 사용할 수 있습니다.

## C. 누구나 접속하는 사이트 공개하기

1. GitHub에서 **빈 Public 저장소 `mathai-daily`** 생성.
2. 압축을 해제한 폴더의 **모든 파일을 저장소 루트에 업로드**. 특히 숨김 폴더 `.github/workflows`가 누락되지 않도록 주의.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions** 설정.
4. **Actions → Publish MathAI Daily**에서 첫 배포 성공 확인. 이어 **Run workflow**를 눌러 실제 뉴스를 수집.
5. **https://GITHUB_사용자명.github.io/mathai-daily/** 로 접속.

소스코드를 수정하면 자동으로 다시 배포됩니다. 매일 **한국 시간 오전 7:17 예정**으로 수집되지만 GitHub 실행은 지연될 수 있습니다.

## D. 한국어·영어 기사 요약 자동 생성하기 (선택)

1. OpenAI API 키 발급 (별도 API 과금).
2. **GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret**.
3. 이름 `OPENAI_API_KEY`, 값에 API 키 저장.
4. **Actions → Publish MathAI Daily → Run workflow** 다시 실행.

API 키는 **사이트 소스코드나 `data/news.json`에 직접 넣지 마세요**.

## E. 문제 해결

- **`index.html`을 더블클릭했는데 카드가 비어 있다** → 로컬 HTTP 서버로 실행해 주세요.
- **사이트 404 오류** → GitHub Pages Source를 `GitHub Actions`로 설정했는지 확인하세요.
- **뉴스가 갱신되지 않는다** → Actions 실행 로그를 열고 RSS 요청 실패 또는 저장소 쓰기 권한을 확인하세요.
- **자동 갱신은 되는데 한국어 기사 요약이 없다** → `OPENAI_API_KEY` Secret, 과금 및 호출 한도를 확인하세요.
- **모든 수집원 접속 실패** → 마지막 정상 `data/news.json`은 덮어쓰지 않도록 설계되어 있습니다.

자세한 파일 구조, 한계, 테스트 및 확장 방향은 `README.md`를 참고하세요.
