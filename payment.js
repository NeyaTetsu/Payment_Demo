(function (){
    //古いブラウザ用
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    //決済方法選択画面
    const select_window = document.getElementById("select_window");
    //決済画面
    const payment_window = document.getElementById("payment_window");
    //選択画面に戻るボタン
    const payment_back_button = document.getElementById("payment_back_button");
    //音声
    const audio = document.getElementById("audio");
    //処理中
    let view_payment_window = false;
    let payment_processing = false;
    let sleep_events = [];


    //初期化
    function init(){
        audioStop();
        stopAllSleepEvents();
        view_payment_window = false;
        select_window.classList.remove("display_none");
        payment_window.classList.add("display_none");
    }
    //音声を停止
    function audioStop(){
        audio.pause();
        audio.currentTime = 0;
    }
    //setTimeoutを全てクリア
    function stopAllSleepEvents(){
        for(let i = 0; i < sleep_events.length; i++){
            clearTimeout(sleep_events[i]);
        }
        sleep_events.splice(0);
    }
    init();


    //各種支払方法
    //クレジット
    const select_credit = document.getElementById("select_credit");
    select_credit.addEventListener("click", () => {
        togglePaymentSelectWindow();
        setCredit();
    });
    //電子マネー
    let serviceName;
    let paymentLimit;
    let audioFiles = {
        done: "",
        error0: "",
    };
    let errorMesseage;
    let errorFastResponce;
    let processingTime;
    //iD
    const select_iD = document.getElementById("select_iD");
    select_iD.addEventListener("click", async () => {
        serviceName = "iD";
        paymentLimit = 30000;
        audioFiles = {
            done: "./sound/id.mp3",
            error0: "./sound/iD Error.wav",
            error1: "./sound/Again 1.wav"
        };
        errorMesseage = [["　", "お取り扱いできません"], ["もう一度", "タッチしてください"]];
        errorFastResponce = [false, true];
        processingTime = 300;
        togglePaymentSelectWindow();
        await wakeupFeliCa();
        setFeliCa();
    });
    //QUICPay
    const select_QUICPay = document.getElementById("select_QUICPay");
    select_QUICPay.addEventListener("click", async () => {
        serviceName = "QUICPay";
        paymentLimit = 30000;
        audioFiles = {
            done: "./sound/quicpay.mp3",
            error0: "./sound/QUICPay Error.wav",
            error1: "./sound/Again 1.wav"
        };
        errorMesseage = [["　", "お取り扱いできません"], ["もう一度", "タッチしてください"]];
        errorFastResponce = [false, true];
        processingTime = 300;
        togglePaymentSelectWindow();
        await wakeupFeliCa();
        setFeliCa();
    });
    //交通系IC
    const select_TransportationIC = document.getElementById("select_TransportationIC");
    select_TransportationIC.addEventListener("click", async () => {
        serviceName = "交通系";
        paymentLimit = 20000;
        audioFiles = {
            done: "./sound/transportationic.mp3",
            error0: "./sound/Error.wav",
            error1: "./sound/Error.wav"
        };
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 600;
        togglePaymentSelectWindow();
        await wakeupFeliCa();
        setFeliCa();
    });
    //WAON
    const select_WAON = document.getElementById("select_WAON");
    select_WAON.addEventListener("click", async () => {
        serviceName = "WAON";
        paymentLimit = 50000;
        audioFiles = {
            done: "./sound/waon.mp3",
            error0: "./sound/WAON Error.wav",
            error1: "./sound/WAON Error.wav"
        };
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 600;
        togglePaymentSelectWindow();
        await wakeupFeliCa();
        setFeliCa();
    });
    //Edy
    const select_Edy = document.getElementById("select_Edy");
    select_Edy.addEventListener("click", async () => {
        serviceName = "楽天Edy";
        paymentLimit = 50000;
        audioFiles = {
            done: "./sound/edy.mp3",
            error0: "./sound/Edy Error.wav",
            error1: "./sound/Edy Error.wav"
        };
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 600;
        togglePaymentSelectWindow();
        await wakeupFeliCa();
        setFeliCa();
    });
    //nanaco
    const select_nanaco = document.getElementById("select_nanaco");
    select_nanaco.addEventListener("click", async () => {
        serviceName = "nanaco";
        paymentLimit = 50000;
        audioFiles = {
            done: "./sound/nanaco.mp3",
            error0: "./sound/Error.wav",
            error1: "./sound/Error.wav"
        };
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 600;
        togglePaymentSelectWindow();
        await wakeupFeliCa();
        setFeliCa();
    });
    //nanaco
    const select_PiTaPa = document.getElementById("select_PiTaPa");
    select_PiTaPa.addEventListener("click", async () => {
        serviceName = "PiTaPa";
        paymentLimit = 30000;
        audioFiles = {
            done: "./sound/pitapa.mp3",
            error0: "./sound/pitapa_error.wav"
        };
        errorMesseage = [["　", "お取り扱いできません"]];
        errorFastResponce = [false];
        processingTime = 300;
        togglePaymentSelectWindow();
        await wakeupFeliCa();
        setFeliCa();
    });
    //Paseli
    const select_Paseli = document.getElementById("select_Paseli");
    select_Paseli.addEventListener("click", async () => {
        serviceName = "Paseli";
        paymentLimit = 20000;
        audioFiles = {
            done: "./sound/paseli.mp3",
            error0: "./sound/Error.wav",
            error1: "./sound/Error.wav"
        };
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 400;
        togglePaymentSelectWindow();
        await wakeupFeliCa();
        setFeliCa();
    });


    //決済ボタン表示
    const pay_credit = document.getElementById("pay_credit");
    const pay_Felica = document.getElementById("pay_FeliCa");
    //クレジット決済画面を待機
    function setCredit(){
        view_payment_window = true;
        pay_credit.classList.remove("display_none");
        pay_Felica.classList.add("display_none");
        setPaymentMethodDisplay("売上", "クレジット", randomAmount(15000));
        setStatusDisplay(["　","カードをどうぞ"]);
        payButtonStby(pay_credit);
    }
    //電子マネー決済画面を待機
    async function wakeupFeliCa(){
        view_payment_window = true;
        pay_Felica.classList.remove("display_none");
        pay_credit.classList.add("display_none");
        setPaymentMethodDisplay("　", "　", "　");
        setStatusDisplay(["読み込み中","お待ちください"]);
        payButtonClear(pay_credit);
        payment_processing = true;
        await loadAudioFiles();
    }
    function setFeliCa(){
        view_payment_window = true;
        pay_Felica.classList.remove("display_none");
        pay_credit.classList.add("display_none");
        setPaymentMethodDisplay("売上", serviceName, randomAmount(paymentLimit));
        setStatusDisplay(["　","タッチしてください"]);
        payButtonStby(pay_Felica);
        payment_processing = false;
    }
    
    //ステータスモニターの表示
    function setPaymentMethodDisplay(method_type, method_name, amount){
        document.getElementById("payment_method_type").innerText = method_type;
        document.getElementById("payment_method_name").innerText = method_name;
        document.getElementById("payment_amount").innerText = amount;
    }
    function setStatusDisplay(status){
        document.getElementById("payment_status0").innerText = status[0];
        document.getElementById("payment_status1").innerText = status[1];
    }


    //支払い！
    //クレジットで！
    pay_credit.addEventListener("pointerdown", () => {
        if(payment_processing){
            return false;
        }
        payment_processing = true;

        const error = randomErrorEvent();
        playCreditSound(!error);
        if(error){
            setStatusDisplay(["１枚だけ", "かざしてください"]);
            payButtonError(pay_credit);
            doneCreditPayment();
            return false;
        }

        let cardTap = true;
        let paymentCommunicating = true;
        let timeOut = false;
        setStatusDisplay(["受け付けました", "ｶｰﾄﾞをお取りください"]);
        payButtonDone(pay_credit);
        //3秒待つ
        sleep_events.push(setTimeout(() => {
            if(cardTap){
                timeOut = true;
                playCreditSound(false);
                setStatusDisplay(["　", "ｶｰﾄﾞをお取りください"]);
                payButtonError(pay_credit);
            }else{
                communicating();
            }
        }, 3000));
        //5秒待つ
        sleep_events.push(setTimeout(() => {
            paymentCommunicating = false;
            if(!timeOut){
                approved();
            }
        }, 5000));

        document.addEventListener("pointerup", () => {
            cardTap = false;
            if(timeOut){
                timeOut = false;
                if(paymentCommunicating){
                    communicating();
                }else{
                    approved();
                }
            }
        });

        function communicating(){
            setStatusDisplay(["センタ通信中です", "お待ちください"]);
            payButtonClear(pay_credit);
        }
        function approved(){
            setStatusDisplay(["　", "承認されました"]);
            payButtonClear(pay_credit);
            doneCreditPayment();
        }

        function doneCreditPayment(){
            sleep_events.push(setTimeout(() => {
                if(payment_processing){
                    payment_processing = false;
                    stopAllSleepEvents();
                    setCredit();
                }
            }, 2000));
        }
    });

    //電子マネーで！
    pay_Felica.addEventListener("pointerdown", () => {
        if(payment_processing){
            return false;
        }
        payment_processing = true;

        let audioBufName = "done";
        let responce = false;
        let lastStatus = ["　", "取引が完了しました"];
        const error = randomErrorEvent();
        if(error){
            let i = Math.floor(Math.random() * errorMesseage.length);
            audioBufName = `error${i}`;
            responce = errorFastResponce[i];
            lastStatus = errorMesseage[i];
        }else{
            audioBufName = "done";
        }
        setStatusDisplay(["　", "処理中です"]);
        payButtonDone(pay_Felica);
        if(!responce){
            sleep_events.push(setTimeout(() => {
                setStatusDisplay(lastStatus);
                errorFelicaPayment();
            }, processingTime));
        }else{
            setStatusDisplay(lastStatus);
            errorFelicaPayment();
        }
        if(!error){
            playSound(audioBufName);
        }

        function errorFelicaPayment(){
            if(error){
                playSound(audioBufName);
                payButtonError(pay_Felica);
            }else{
                payButtonClear(pay_Felica);
            }
            doneFeliCaPayment();
        }

        function doneFeliCaPayment(){
            sleep_events.push(setTimeout(() => {
                if(payment_processing){
                    payment_processing = false;
                    stopAllSleepEvents();
                    setFeliCa();
                }
            }, 2000));}
    });


    //画面切り替え
    //決済方法選択画面と決済画面の切り替え
    function togglePaymentSelectWindow(){
        //select_window.classList.toggle("display_none");
        //payment_window.classList.toggle("display_none");
        select_window.classList.add("display_none");
        payment_window.classList.remove("display_none");
        history.pushState({page: 1}, '', window.location.href);
    }

    function payButtonStby(elem){
        elem.classList.remove("done", "error");
        elem.classList.add("stby");
    }
    function payButtonDone(elem){
        elem.classList.remove("stby", "error");
        elem.classList.add("done");
    }
    function payButtonError(elem){
        elem.classList.remove("stby", "done");
        elem.classList.add("error");
    }
    function payButtonClear(elem){
        elem.classList.remove("stby", "done", "error");
    }


    //戻る
    payment_back_button.addEventListener("click", () => {
        history.back();
        backSelectWindow();
    });
    window.addEventListener('popstate', (e) => {
        if(view_payment_window){
            backSelectWindow();
        }
    });
    function backSelectWindow(){
        payment_processing = false;
        init();
    }
    
    
    //ランダム金額
    function randomAmount(maxValue){
        let x = Math.floor(Math.random() * (maxValue + 1));
        return x;
    }
    //ランダムエラーイベント
    function randomErrorEvent(){
        //エラー発生をオンにしているかチェック
        let errormode = document.getElementById("errormode").checked;
        //発生確率（30%）
        const rate = .3;
        if(errormode && Math.random() < rate){
            return true;
        }else{
            return false;
        }
    }


    // Web Audio API用のコンテキスト
    let audioContext = new AudioContext();
    // 音声ソース読み込み後のバッファ格納用
    let audioBuffers = {};

    // 音声ファイル読み込み実行
    async function loadAudioFiles(){
        // プロパティ毎にオブジェクトにして配列として取得
        const entries = Object.entries(audioFiles);
        // 音声ソースを読み込んで音声バッファに格納する
        audioBuffers = await getAudioBuffer(entries);
        //console.log("音声ソース読み込み完了！");
    }
    
    // 音声ソース読み込み関数
    const getAudioBuffer = async (entries) => {
        const promises = []; // 読み込み完了通知用
        const buffers = {}; // オーディオバッファ格納用
    
        entries.forEach((entry)=>{
            const promise = new Promise((resolve)=>{
                const [name, url] = entry; // プロパティ名、ファイルのURLに分割
                //console.log(`${name}[${url}] 読み込み開始...`);
    
                // 音声ソース毎に非同期で読み込んでいく
                fetch(url)
                .then(response => response.blob()) // ファイル生データ
                .then(data => data.arrayBuffer()) // ArrayBufferとして取得
                .then(arrayBuffer => {
                    // ArrayBufferを音声データに戻してオブジェクト配列に格納する
                    audioContext.decodeAudioData(arrayBuffer, function(audioBuffer){
                        buffers[name] = audioBuffer;
                        //console.log(`audioBuffers["${name}"] loaded. オーディオバッファに格納完了！`);
                        resolve(); // 読み込み完了通知をpromiseに送る
                    });
                });
            })
            promises.push(promise); // 現在実行中のPromiseを格納しておく
        });
        await Promise.all(promises); // 全ての音声ソース読み込みが完了してから
        return buffers; // オーディオバッファを返す
    };
    
    // 再生関数（引数はaudioBuffersのプロパティ名）
    const playSound = function(name){
        if(audioContext.state === "suspended"){
            audioContext.resume();
        }
    
        let source = audioContext.createBufferSource(); // 再生用のノードを作成
        source.buffer = audioBuffers[name]; // オーディオバッファをノードに設定
        source.connect(audioContext.destination); // 出力先設定
        source.start(); // 再生
    };


    //クレジット決済音を生成
    function playCreditSound(done){
        let ctx, osc, amp = null;
        //trueなら成功音、falseならエラー音を生成
        let gain = 1;
        let freq;
        if(done){
            freq = 1500;
        }else{
            freq = 750;
        }
        ctx = new AudioContext();
        osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        amp = ctx.createGain();
        amp.gain.value = gain;
        osc.connect(amp).connect(ctx.destination);
        //再生
        if(done){
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + .5);
        }else{
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + .6);
            amp.gain.setValueAtTime(0, ctx.currentTime + .2);
            amp.gain.setValueAtTime(gain, ctx.currentTime + .4);
        }
        return false;
    }
}());


