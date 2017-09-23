const recognize = new webkitSpeechRecognition();
const result = document.getElementById('result');
const btn = document.getElementById('trigger');
const timestamp = 5000;
let number = []
axios.get('http://invoice.etax.nat.gov.tw/')
    .then(body=>{
        $(body.data).find('.t18Red')
            .each((i,e)=>{
                if(i<=3){
                    if(e.innerText.includes('、'))
                        number.concat(e.innerText.split('、'))
                    else
                        number.push(e.innerText)
                } 
            })
    })
let timer;

(function () {
    'use strict';

    recognize.continuous = true;
    recognize.interimResults = false;
    recognize.lang = 'cmn-Hant-TW';

    recognize.onstart = function () {
        console.log('開始辨識...');
        document.body.style.backgroundColor = 'green'
    };
    recognize.onend = function () {
        console.log('停止辨識!');
    };
    recognize.onresult = function (event) {
        console.log(event);

        var i = event.resultIndex;
        var j = event.results[i].length - 1;
        let val = event.results[i][j].transcript;
        console.log(val);
        if (!(/\d{3}/.test(val))) {
            document.body.style.backgroundColor = "yellow"
            return;
        }

        let res = number.find(function (num) {
            console.log(typeof num);
            if (typeof val !== 'string' && typeof val === 'number') {
                val = val.toString();
            }
            let reg = new RegExp(val + '$');

            return reg.test(num);
        });
        let final = (res === undefined) ? '沒有中獎' : (()=>{
            let a = number.indexOf(res);
            return a < 1 ? '可能特別獎' : a < 2 ? '可能特獎' : a < 5 ? '可能頭獎' : '就是增開六獎'})();
        console.log(final);
        if (res !== undefined) {
            document.body.style.backgroundColor = "red";
        } else {
            document.body.style.backgroundColor = "white"
        }
        //   console.log(event.results[i][j].transcript);
        result.innerHTML = (typeof final === 'number' ? final.toString() : final) + ' : ' + val;
    };

})();
let interval;

function trigger() {
    if (btn.value === 'off') {
        recognize.stop()
        clearInterval(interval);
        btn.value = 'on';
        document.body.style.backgroundColor = 'purple'
    } else {
        recognize.start()
        btn.value = 'off';
        interval = setInterval(function () {
            recognize.stop();
            recognize.start();
        }, 2000);
    }
}