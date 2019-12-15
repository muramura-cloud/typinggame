'use script';//厳密なエラーテェック

{
  const target=document.getElementById('target');
  const scoreLabels=document.getElementById('score');
  const missLabels=document.getElementById('miss');
  const timer=document.getElementById('timer');
  const scoredModal=document.getElementById('scoredModal');
  const scored=document.getElementById('scored');
  const missed=document.getElementById('missed');
  const timed=document.getElementById('timed');
  const typed=document.getElementById('typed');
  const wpmed=document.getElementById('wpmed');
  const accuracy=document.getElementById('accuracy');
  let score;
  let miss;
  let startTime;//経過時間を表示するのに使うクリックされた時の最初の時間
  let loc;//wordの文字で何番目かを取得する入れ物
  const words=[
    'apple',
    'cherry',
    'orange',
    'orangejuice',
  ];//タイピングしてもらう文字
  let word;
  let timeoutId;//どこでも使えるようにここで宣言している。
  let isPlaying=false;
  let d;//showResultとcountUpで必要なため前もって宣言している。
  let s;//showResultとcountUpで必要なため前もって宣言している。
  let ms;//showResultとcountUpで必要なため前もって宣言している。
  
  //経過時間を表示する関数
  function countUp() {
    d=new Date(Date.now()-startTime);
    s=d.getSeconds();
    ms=d.getMilliseconds();
    timer.textContent=`${s}.${ms}`
    timeoutId=setTimeout(()=> {//ループ
      countUp();
    },10);
  }
  //タイプが正解した文字をアンダーバーにする関数
  function updateTarget() {
    let placeholder='';
    //正解した数つまりlocの数（locは正解すると＋１される）だけのアンダーバーを生成し格納する
    for(let i=0;i<loc;i++) {
      placeholder+='_';
    }
    target.textContent=placeholder+word.substring(loc);
  }
  //文字が全部で切った後に結果を表示する関数
  function showResult() {
    scoredModal.classList.remove('none');//toggleだと思い通りに行かないから一つずつクラスを付け外ししている。
    scoredModal.classList.add('show');
    const wpm=((((score+miss)/s+(ms/=1000))*60)).toFixed(2);//調整
    scored.textContent=score;
    missed.textContent=miss;
    accuracy.textContent=score+miss===0?0:(score/(score+miss)*100).toFixed(2)+'%';
    timed.textContent=s+'.'+ms*1000;
    typed.textContent=score+miss;
    wpmed.textContent=wpm;
    // alert(`正解:${score} ミス:${miss} 精度:${accuracy}％ 経過時間:${s}.${ms*1000} 打鍵数:${score+miss} WPM:${wpm}  お疲れ様でした！`);
  }
  
  //windowがクリックされたら起こるイベント
  window.addEventListener('click',()=>{
    if(isPlaying===true) {
      return;
    }
    scoredModal.classList.remove('show');//toggleだと思い通りに行かないから一つずつクラスを付け外ししている。
    scoredModal.classList.add('none');
    score=0;
    miss=0;
    loc=0;
    isPlaying=true;
    console.log(score+'：scoreの数');
    console.log(miss+'：missの数');
    console.log(loc+'：locの数');
    console.log(words);
    scoreLabels.textContent=score;
    missLabels.textContent=miss;
    word=words.shift();
    target.textContent=word;
    timer.textContent='0.00';//初期化
    startTime=Date.now();
    countUp();
  });
  
  //キーボードを入力したするたびに発生するイベント
  window.addEventListener('keydown',(e)=> {
    if(isPlaying===false) {
      return;
    }
    if(word[loc]===e.key) {//キーボードで入力した文字がwordで表示された文字と同じかどうか判定
      score++;
      loc++;
      scoreLabels.textContent=score;
      updateTarget();
      if(loc===word.length) {//今の要素の文字を全て打ち終えたら
        for(i = words.length - 1; i > 0; i--) {//残ったwords配列の要素をシャッフルする。補完しあいながらランダムしている。
          var j = Math.floor(Math.random() * (i + 1));
          var tmp = words[i];
          words[i] = words[j];//ここでランダムに選ばれた配列の要素を前の要素から順番に入れ替えしている。
          words[j] = tmp;
        }
        console.log(words);
        if(words.length<=0) {//配列内要素が空になった時
          clearTimeout(timeoutId);//関数内で定義した変数は基本的にはその関数でしか使えないことは体感しました。
          timer.textContent='0.00';
          setTimeout(()=>{
            showResult();
          },100);
          words.push(//もう一回できるように配列を補充
            'apple',
            'cherry',
            'orange',
            'orangejuice'
          );
          isPlaying=false;
          return target.textContent='';//空白を入れることで配列の要素が入るのを防ぐ。これが無いと次の回から配列が３つになる。
        }
        //上のif文とここの抜き取る作業の順番がとても大事もし逆だと早い段階でif文(words.length<=0)がtrueになってしまう。
        word=words.shift();
        target.textContent=word;
        loc=0;
      }
    }else {
      miss++;
      missLabels.textContent=miss;
    }
  });
}



