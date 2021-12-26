/*スクリプトが紐付いているフォームに新規の回答が送信され次第、指定したメールアドレスへ自動で通知する*/
/*シンプル版：単純にフォームの回答内容が文字列で通知される。回答者への回答コピー送信、回答内容の設問別取得・判別・条件分岐等、複雑な処理は一切無し。*/

// FormApp.getActiveForm()
function notifyFormNewAnswerSimple(e) {
  Logger.log('notifyFormNewAnswerSimple(e) debug start')

  /*送受信関連変数の設定*/
  const mailFrom      = 'sender@example.com'; /*送信者（スクリプトを実行するGoogleアカウントのGmailにおいて送信者として使用可能なものを指定する）*/
  const mailFromName  = 'Example Sender'; /*送信者の名称（氏名や団体名など、日本語も可）*/
  const mailTo        = 'recipient@example.com'; /*主たる受取人（Google App Scriptの制限に抵触しないようToに設定するメールアドレスの数は最小限に抑えたほうがよい）*/
  const mailCc        = ''; /*写し受信者（複数列挙はカンマで、必要なければ空欄でよい）*/
  const mailBcc       = ''; /*秘密受信者（複数列挙はカンマで、必要なければ空欄でよい）*/
  const mailReplyTo   = ''; /*返信先（必要なければ空欄でよい）*/

  /*メールの件名と本文の執筆*/
  const subject     = 'Googleフォームに新しい回答が送信されました。'; /*件名*/
  const introduction /*本文（前置き、適宜内容を書き換える）*/
    = '受取人様\n\n'
    + 'Googleフォームに新しい回答が送信されました。\n'
    + '内容を確認のうえ、すみやかに対応してください。\n'
    + 'フォームに送信された回答の詳細は次の通りです。\n'
    + '------------------------------------------------------------\n\n';
  var formAnswer /*本文（フォームの回答内容、後で再定義・再代入されるため、ここではvarにして、かつ空にしている）*/
    = '';
  const closing /*本文（締め、適宜内容を書き換える）*/
    = '------------------------------------------------------------\n\n'
    + 'ご不明な点などございましたら、下記メールアドレスまでご連絡ください。\n\n';
  const signature /*署名（適宜内容を書き換える）*/
    = '==============================\n'
    + ' フォームの管理担当者\n'
    + ' sender@example.com\n'
    + '==============================\n\n';

  /*フォームに送信された回答を取得し、responsesオブジェクトに格納する*/
  const responses = e.response.getItemResponses();

  /*responsesオブジェクトに格納されたフォームの回答を、人間にとって可読性の高い文字列に整形する*/
  for (var i = 0; i < responses.length; i++) {
    var item      = responses[i];
    var question  = item.getItem().getTitle();
    var answer    = item.getResponse();
    formAnswer += '【'+ question + '】' + '\n' + '　' + answer + '\n\n'
  }

  /*初めに設定した変数と、直上で整形したフォームの回答文字列とを、結合してメール本文を完成させる*/
  const body = introduction+formAnswer+closing+signature;

  /*以上を踏まえてメールを送信する*/
  GmailApp.sendEmail(mailTo, subject, body,
    {
      cc: mailCc,
      bcc: mailBcc,
      from: mailFrom,
      name: mailFromName,
      replyTo: mailReplyTo
    });
}
