var select = document.querySelector('#select-area');
var zone = new Set();
var xhr = makeReq('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97');
window.addEventListener('load', getOptions);
//取得選項資料
function getOptions(e) {
    if (xhr) {
        xhr.onload = function () {
            if (xhr.status == 200) {
                var responseText = JSON.parse(xhr.responseText);
                var data = responseText.result.records;
                for (let i = 0; i < data.length; i++) {
                    zone.add(data[i].Zone);
                }
                //判定選項是否超過一個，如果是跳出，否就繼續執行
                var option = document.querySelectorAll('option');
                if (option.length !== 1) return;
                //呼叫渲染
                renderOptions(zone);
            } else {
                console.log(`Request are unsuccessful : ${xhr.status}`);
            }
        }
    } else {
        console.log('Cannot create an XMLHTTP instance')
        return false;
    }
}
//渲染高雄區的選項
function renderOptions(data) {
    data.forEach(zone => {
        var opt = document.createElement('option');
        opt.value = zone;
        opt.textContent = zone;
        select.appendChild(opt);
    });
}
// 用來驗證瀏覽器是否有支援CORS Request
function makeReq(method, url) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
        xhr.open(method, url, true);
    } else {
        xhr = null;
    }
    return xhr;
}

xhr.send(null);