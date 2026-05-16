PTA適正化推進委員会サイト donate.html 差し替えZIP

内容:
1. donate.html
   - ルート直下に配置してください。
   - 既存の donate.html をこのファイルで上書きします。

2. donate/index.html
   - /donate/ でアクセスされた場合に ../donate.html へ転送する補助ファイルです。
   - GitHub Pages 上で https://ptaorg.github.io/pta/donate/ からも到達できるようにするためのものです。

3. index_home_actions_snippet.html
   - トップページの .home-actions に「支援する」ボタンを戻すための差し替え断片です。

4. nav_link_snippet.html
   - 上部ナビゲーションに「支援」を戻す場合の追加断片です。

補足:
- 元テキスト内のPayPayリンク末尾に半角スペースが入っていたため、href内の末尾空白のみ除去しています。
- 銀行口座・PayPayリンク等の内容は、提供されたHTML本文に基づいています。
