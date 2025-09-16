(function (){
    //決済方法選択画面
    const select_window = document.getElementById("select_window");
    //決済画面
    const payment_window = document.getElementById("payment_window");
    //選択画面に戻るボタン
    const payment_back_button = document.getElementById("payment_back_button");
    //音声
    const audio = document.getElementById("audio");
    //処理中
    let payment_processing = false;
    let sleep_events = [];


    //初期化
    function init(){
        audioStop();
        stopAllSleepEvents();
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
        setCredit();
        togglePaymentSelectWindow();
    });
    //電子マネー
    let serviceName;
    let paymentLimit;
    let doneSoundFile;
    let errorSoundFile;
    let errorMesseage;
    let errorFastResponce;
    let processingTime;
    //iD
    const select_iD = document.getElementById("select_iD");
    select_iD.addEventListener("click", () => {
        serviceName = "iD";
        paymentLimit = 30000;
        doneSoundFile = "./sound/id.mp3";
        doneSouudType = "audio/mp3";
        errorSoundFile = ["./sound/iD Error.wav", "./sound/Again 1.wav"];
        errorSoundType = ["audio/wav", "audio/wav"];
        errorMesseage = [["　", "お取り扱いできません"], ["もう一度", "タッチしてください"]];
        errorFastResponce = [false, true];
        processingTime = 300;
        setFeliCa();
        togglePaymentSelectWindow();
    });
    //QUICPay
    const select_QUICPay = document.getElementById("select_QUICPay");
    select_QUICPay.addEventListener("click", () => {
        serviceName = "QUICPay";
        paymentLimit = 30000;
        doneSoundFile = "./sound/quicpay.mp3";
        doneSouudType = "audio/mp3";
        errorSoundFile = ["./sound/QUICPay Error.wav", "./sound/Again 1.wav"];
        errorSoundType = ["audio/wav", "audio/wav"];
        errorMesseage = [["　", "お取り扱いできません"], ["もう一度", "タッチしてください"]];
        errorFastResponce = [false, false, true];
        processingTime = 800;
        setFeliCa();
        togglePaymentSelectWindow();
    });
    //交通系IC
    const select_TransportationIC = document.getElementById("select_TransportationIC");
    select_TransportationIC.addEventListener("click", () => {
        serviceName = "交通系";
        paymentLimit = 20000;
        doneSoundFile = "./sound/transportationic.mp3";
        doneSouudType = "audio/mp3";
        errorSoundFile = ["./sound/Error.wav", "./sound/Error.wav"];
        errorSoundType = ["audio/wav", "audio/wav"];
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 800;
        setFeliCa();
        togglePaymentSelectWindow();
    });
    //WAON
    const select_WAON = document.getElementById("select_WAON");
    select_WAON.addEventListener("click", () => {
        serviceName = "WAON";
        paymentLimit = 50000;
        doneSoundFile = "./sound/waon.mp3";
        doneSouudType = "audio/mp3";
        errorSoundFile = ["./sound/WAON Error.wav", "./sound/Error.wav"];
        errorSoundType = ["audio/wav", "audio/wav"];
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 100;
        setFeliCa();
        togglePaymentSelectWindow();
    });
    //Edy
    const select_Edy = document.getElementById("select_Edy");
    select_Edy.addEventListener("click", () => {
        serviceName = "楽天Edy";
        paymentLimit = 50000;
        doneSoundFile = "./sound/edy.mp3";
        doneSouudType = "audio/mp3";
        errorSoundFile = ["./sound/Edy Error.wav", "./sound/Error.wav"];
        errorSoundType = ["audio/wav", "audio/wav"];
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 200;
        setFeliCa();
        togglePaymentSelectWindow();
    });
    //nanaco
    const select_nanaco = document.getElementById("select_nanaco");
    select_nanaco.addEventListener("click", () => {
        serviceName = "nanaco";
        paymentLimit = 50000;
        doneSoundFile = "./sound/nanaco.mp3";
        doneSouudType = "audio/mp3";
        errorSoundFile = ["./sound/Error.wav", "./sound/Error.wav"];
        errorSoundType = ["audio/wav", "audio/wav"];
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 100;
        setFeliCa();
        togglePaymentSelectWindow();
    });
    //nanaco
    const select_PiTaPa = document.getElementById("select_PiTaPa");
    select_PiTaPa.addEventListener("click", () => {
        serviceName = "PiTaPa";
        paymentLimit = 30000;
        doneSoundFile = "./sound/pitapa.mp3";
        doneSouudType = "audio/mp3";
        errorSoundFile = ["./sound/pitapa_error.wav"];
        errorSoundType = ["audio/wav"];
        errorMesseage = [["　", "お取り扱いできません"]];
        errorFastResponce = [false];
        processingTime = 400;
        setFeliCa();
        togglePaymentSelectWindow();
    });
    //Paseli
    const select_Paseli = document.getElementById("select_Paseli");
    select_Paseli.addEventListener("click", () => {
        serviceName = "Paseli";
        paymentLimit = 20000;
        doneSoundFile = "./sound/paseli.mp3";
        doneSouudType = "audio/mp3";
        errorSoundFile = ["./sound/Error.wav", "./sound/Error.wav"];
        errorSoundType = ["audio/wav", "audio/wav"];
        errorMesseage = [["　", "残額不足"], ["　", "お取り扱いできません"]];
        errorFastResponce = [true, true];
        processingTime = 400;
        setFeliCa();
        togglePaymentSelectWindow();
    });


    //決済ボタン表示
    const pay_credit = document.getElementById("pay_credit");
    const pay_Felica = document.getElementById("pay_FeliCa");
    //クレジット決済画面を待機
    function setCredit(){
        pay_credit.classList.remove("display_none");
        pay_Felica.classList.add("display_none");
        setPaymentMethodDisplay("売上", "クレジット", randomAmount(15000));
        setStatusDisplay(["　","カードをどうぞ"]);
        payButtonStby(pay_credit);
    }
    //電子マネー決済画面を待機
    function setFeliCa(){
        pay_credit.classList.add("display_none");
        pay_Felica.classList.remove("display_none");
        setPaymentMethodDisplay("売上", serviceName, randomAmount(paymentLimit));
        setStatusDisplay(["　","タッチしてください"]);
        payButtonStby(pay_Felica);
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
        if(error){
            playCreditSound(false);
            setStatusDisplay(["１枚だけ", "かざしてください"]);
            payButtonError(pay_credit);
            doneCreditPayment();
            return false;
        }

        let cardTap = true;
        let paymentCommunicating = true;
        let timeOut = false;
        playCreditSound(true);
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
    pay_Felica.addEventListener("click", () => {
        if(payment_processing){
            return false;
        }
        payment_processing = true;

        let respoce = false;
        let lastStatus = ["　", "取引が完了しました"];
        const error = randomErrorEvent();
        if(error){
            if(Array.isArray(errorSoundFile)){
                let i = Math.floor(Math.random() * errorSoundFile.length);
                audio.src = errorSoundFile[i];
                audio.type = errorSoundType[i];
                respoce = errorFastResponce[i];
                lastStatus = errorMesseage[i];
            }else{
                audio.src = errorSoundFile;
                audio.type = errorSoundType;
                respoce = errorFastResponce;
                lastStatus = errorMesseage;
            }
        }else{
            audio.src = doneSoundFile;
            audio.type = doneSouudType;
        }
        setStatusDisplay(["　", "処理中です"]);
        payButtonDone(pay_Felica);
        if(!respoce){
            sleep_events.push(setTimeout(() => {
                setStatusDisplay(lastStatus);
                errorFelicaPayment();
            }, processingTime));
        }else{
            setStatusDisplay(lastStatus);
            errorFelicaPayment();
        }
        if(!error){
            audio.play();
        }

        function errorFelicaPayment(){
            if(error){
                audio.play();
                payButtonError(pay_Felica);
            }
            doneFeliCaPayment();
        }

        function doneFeliCaPayment(){
            payButtonClear(pay_Felica);
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
        select_window.classList.toggle("display_none");
        payment_window.classList.toggle("display_none");
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
        payment_processing = false;
        init();
    });
}());


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
//その他ランダムイベント
function randomEvent(rate){
    if(Math.random() < rate){
        return true;
    }else{
        return false;
    }
}


//待機時間
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


//クレジット決済音を生成
function playCreditSound(done){
    //trueなら成功音、falseならエラー音を生成
    let gain = 1;
    let freq;
    if(done){
        freq = 1500;
    }else{
        freq = 750;
    }
    const ctx = new AudioContext();
    const osc = new OscillatorNode(ctx);
    osc.type = "sine";
    osc.frequency.value = freq;
    const amp = new GainNode(ctx);
    amp.gain.value = gain;
    osc.connect(amp).connect(ctx.destination);
    //再生
    if(done){
        osc.start(0);
        osc.stop(.5);
    }else{
        osc.start(0);
        osc.stop(.6);
        amp.gain.setValueAtTime(0, ctx.currentTime + .2);
        amp.gain.setValueAtTime(gain, ctx.currentTime + .4);
    }
}