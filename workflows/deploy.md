name: Netlify Deploy (Pull Request)

on:
pull_request:
branches: - main # main 브랜치에 PR이 열리면 실행 - develop # develop 브랜치에 PR이 열리면 실행

jobs:
deploy:
runs-on: ubuntu-latest

    steps:
      # 코드 체크아웃
      - name: Checkout code
        uses: actions/checkout@v3

      # 의존성 설치
      - name: Install dependencies
        run: npm install

      # 프로젝트 빌드
      - name: Build project
        run: npm run build

      # Netlify로 배포
      - name: Deploy to Netlify
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        run: |
          npm install -g netlify-cli
          DEPLOY_OUTPUT=$(netlify deploy --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID --message "Deploy for PR to develop" --json)
          DEPLOY_URL=$(echo $DEPLOY_OUTPUT | jq -r .deploy_url)
          echo "Deploy URL: $DEPLOY_URL"
          echo "TEST_DEPLOY_URL=$DEPLOY_URL" >> $GITHUB_ENV

      # PR에 배포 URL을 주석으로 추가
      - name: Add deploy URL to PR comment
        if: github.event_name == 'pull_request'
        run: |
          curl -s -X POST \
            -H "Authorization: token ${{ secrets.MY_PAT }}" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/${{ github.repository }}/issues/${{ github.event.pull_request.number }}/comments \
            -d '{"body": "Test site deployed: '"$TEST_DEPLOY_URL"'"}'