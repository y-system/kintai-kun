function jikyutoroku(){
    var hourprice = document.getElementById('jikyu').value;
    var tani = document.getElementById('tani').value;
    var autostart = document.getElementById('autostart').value;
    var autoend = document.getElementById('autoend').value;
    var autorest = document.getElementById('autorest').value;
    if(autorest==""){autorest="0";}
    if(hourprice!=""&&tani!=""){
        localStorage.setItem('jikyu',hourprice);
        localStorage.setItem('tani',tani);
        localStorage.setItem('jikyu',hourprice);
        localStorage.setItem('autorest',autorest);
        localStorage.setItem('autostart',autostart);
        localStorage.setItem('autoend',autoend);
        alert('時給：'+hourprice+'円\n単位時間：'+tani+'分で登録しました。');
        nyuryoku();
        }else{
        alert('入力が足りません。');
    }
}
function reset(){
    $("#first").css("display", "none");
    $("#working").css("display", "none");
    $("#result").css("display", "none");
    $("#syokisettei").css("display", "none");
    $("#kekka").css("display", "none");
    $("#nyuryoku").css("display", "none");
}
function nyuryoku(){
    reset();
    $("#working").css("display", "block");
    $("#syokisettei").css("display", "block");
    $("#kekka").css("display", "block");
    var nowdate = new Date();
    var year = nowdate.getFullYear();
    var month = nowdate.getMonth() + 1
    var date = nowdate.getDate();
    document.getElementById('year').value=year;
    document.getElementById('day').value=date;
    document.getElementById('month').value=month;
    document.getElementById('starttime').value=localStorage.autostart;
    document.getElementById('finishtime').value=localStorage.autoend;
}
function syoki(){
    reset();
    $("#first").css("display", "block");
    $("#nyuryoku").css("display", "block");
    $("#kekka").css("display", "block");
    $("#clearAll").css("display", "block");
    if(localStorage.jikyu!=null){document.getElementById('jikyu').value=localStorage.jikyu;}
    if(localStorage.tani!=null){document.getElementById('tani').value=localStorage.tani;}
    if(localStorage.autorest!=null){document.getElementById('autorest').value=localStorage.autorest;}
    if(localStorage.autostart!=null){document.getElementById('autostart').value=localStorage.autostart;}
    if(localStorage.autoend!=null){document.getElementById('autoend').value=localStorage.autoend;}
}
function kekka(){
    reset();
    $("#result").css("display", "block");
    $("#syokisettei").css("display", "block");
    $("#nyuryoku").css("display", "block");
    $("#kyuyo").css("display", "none");
    var nowdate = new Date();
    var year = nowdate.getFullYear();
    months(year);
}
$(document).ready(function() {
    startRun();
});
function startRun(){
    if(localStorage.jikyu==null){
        reset();
        $("#first").css("display", "block");
        $("#clearAll").css("display", "none");
        }else{
        nyuryoku();
    }
}
function clearAll(){
    if(confirm('本当にすべてのデータを削除しますか？')){
        localStorage.clear();
        alert('初期化しました。');
        document.getElementById('jikyu').value="";
        document.getElementById('tani').value="";
        syoki();
        reset();
        $("#first").css("display", "block");
        $("#clearAll").css("display", "none");
    }
}
function resistworking(){
    var iyear = document.getElementById('year').value;
    var imonth = document.getElementById('month').value;
    var iday = document.getElementById('day').value;
    var istart = document.getElementById('starttime').value;
    var iend = document.getElementById('finishtime').value;
    var kstart = document.getElementById('kyukeistarttime').value;
    var kend = document.getElementById('kyukeiendtime').value;
    var iimonth= ("0" + imonth).slice(-2);
    var iiday= ("0" + iday).slice(-2);
    var iistart= ("0" + istart).slice(-5);
    var iiend= ("0" + iend).slice(-5);
    if(kstart==""){
        kkstart=0;
        kkend=0;
        }else{
        var kkstart= ("0" + kstart).slice(-5);
        var kkend= ("0" + kend).slice(-5);
        }
    var item=iyear+iimonth+iiday;
    var d = {
      'start': iistart,
      'end': iiend,
      'kyukeistart': kkstart,
      'kyukeiend': kkend
    };
    localStorage.setItem(item,JSON.stringify(d));
    alert(iyear+'年'+imonth+'月'+iday+'日'+istart+'～'+iend+'で登録しました。\nお疲れ様でした。');
}
function months(toshi){
    var nowdate = new Date();
    var year = nowdate.getFullYear();
    var month = nowdate.getMonth() + 1

    if(toshi==year){nagasa=month;}else{nagasa=12;}
    var result = toshi+'年<ul>';
    for(var i = 1;i <= nagasa;i++){
        var ii= ("0" + i).slice(-2);
        result += '<li onclick="getKyuyo('+toshi+','+ii+');">'+i+'月</li>';
    }
    var toshigami =toshi-1;
    var toshishita =toshi+1;
    result += '</ul><span id="zennen">前年<a onclick="months('+toshigami+')">'+toshigami+'年</a></span>';
    if(toshi!=year){result += '<span id="jinen">次年<a onclick="months('+toshishita+')">'+toshishita+'年</a></span>';}
    var target = document.getElementById("months");
    target.innerHTML = result;
}
function getKyuyo(mmmm,nn){
    var mm=("0" +nn).slice(-2);
    var mmmmmm=('0'+mmmm+mm).slice(-6);
    var result = '<table><tr id="title-row"><td></td><td>日付</td><td>出勤</td><td>外出</td><td>再入</td><td>退勤</td><td>実働</td><td>給与</td></tr>';
    var flag=0;
    var shima='odd';
    var tani=localStorage.tani;
    var jikyu=localStorage.jikyu;
    var autorest=localStorage.autorest;
    var cumsumJikan=0;
    var kyukeiJikan=0;
    for(var i = 0;i < localStorage.length;i++){
        var key = localStorage.key(i);
        var match =('0'+key).slice(1,7);
        if(match==mmmmmm){
            var flag=1;
            var datajson = localStorage.getItem(key);
            var data = JSON.parse(datajson);
            var hhend=data.end.slice(0,2);
            var hhstart=data.start.slice(0,2);
            var mmend=data.end.slice(3,5)/tani;
            var mmstart=data.start.slice(3,5)/tani;
            if(data.kyukeistart!=0){
                var khend=data.kyukeiend.slice(0,2);
                var khstart=data.kyukeistart.slice(0,2);
                var kmend=data.kyukeiend.slice(3,5);
                var kmstart=data.kyukeistart.slice(3,5);
                kyukeiJikan=khend-khstart+tani*Math.ceil((kmend-kmstart)/tani);
                }else{
                data.kyukeistart='---';
                data.kyukeiend='---';
            }
            var hun=Math.floor(mmend)*tani/60-Math.ceil(mmstart)*tani/60-kyukeiJikan-autorest/60;
            var jikan=hhend-hhstart+hun;
            var nitto =jikan*jikyu;
            cumsumJikan=cumsumJikan+jikan;
            result += '<tr class="'+shima+'"><td><a class="deleteKyuyo" onclick="deleteKyuyo('+key+');">×</a></td><td>'+('0'+key).slice(5,7)+'/'+('0'+key).slice(7,9)+'</td><td>'+data.start+'</td><td>'+data.kyukeistart+'</td><td>'+data.kyukeiend+'</td><td>'+data.end+'</td><td>'+jikan+'</td><td>￥'+nitto+'</td></tr>';
            if(shima=='odd'){shima='even';}else{shima='odd';}
        }
    }
    if(flag==1){
        result += '</table>';
        var target = document.getElementById('kyuyo');
        target.innerHTML = '<h3>'+mmmm+'年'+mm+'月</h3><h4>合計'+cumsumJikan+'時間・'+Math.ceil(cumsumJikan*jikyu)+'円</h4>'+result;
        }else{
        var target = document.getElementById('kyuyo');
        target.innerHTML ='<h3>'+mmmm+'年'+mm+'月</h3>該当するデータはありません。';
        }
    $("#kyuyo").css("display", "block");
}
function deleteKyuyo(keydate){
    var key=keydate+'0';
    var toshi=key.slice(0,4);
    var tsuki=key.slice(4,6);
    var nichi=key.slice(6,8);
    if(confirm('削除しますか？')){
        localStorage.removeItem(keydate);
        alert(toshi+'年'+tsuki+'月'+nichi+'日分をを削除しました。');
        getKyuyo(toshi,tsuki);
    }
}