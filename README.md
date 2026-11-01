# TypeSprint

TypeSprint는 Python/FastAPI와 HTML/CSS/JavaScript로 만든 로컬 타자 측정 및 타자 게임 웹앱입니다.

## 주요 기능

- 일반 타자 측정: WPM, 정확도, 오타 수, 경과 시간, 문장 진행률 표시
- 타자 게임: 화면 위에서 영어 단어가 떨어지고, 단어를 입력하면 점수 획득
- 게임 규칙: 제한 시간 60초, 목숨 3개, 단어가 바닥에 닿으면 목숨 감소
- 게임 재시작 및 오류 안내
- `/health` 상태 확인 엔드포인트

## 사용 환경

- Windows PowerShell
- Python 3.13 이상 권장
- 가상환경 없이 실행 가능

## 설치

PowerShell에서 이 폴더로 이동한 뒤 의존성을 설치합니다.

```powershell
python -m pip install -r requirements.txt
```

## 실행

```powershell
python main.py
```

실행 후 브라우저에서 다음 주소를 엽니다.

```text
http://127.0.0.1:8000
```

서버 상태는 다음 주소에서 확인할 수 있습니다.

```text
http://127.0.0.1:8000/health
```

종료하려면 실행 중인 PowerShell 창에서 `Ctrl+C`를 누릅니다.

## 프로젝트 구조

```text
upload/
├─ main.py
├─ requirements.txt
├─ README.md
├─ .gitignore
└─ static/
   ├─ index.html
   ├─ style.css
   └─ app.js
```

인증정보, 개인정보, 캐시, 로그, 가상환경, 테스트 산출물 및 대용량 파일은 업로드 구성에 포함하지 않았습니다.
