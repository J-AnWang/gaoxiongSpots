const select = document.querySelector('#select-area');
const toTop = document.querySelector('.toTop');
const content = document.querySelector('#content .container');
const footer = document.querySelector('#footer');
const zone = new Set();
const scrollTrigger = 200;
const xhr = makeReq('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97');
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
            createOptionsListener();
        }
    } else {
        console.log('Cannot create an XMLHTTP instance')
        return false;
    }
}
//渲染高雄區的選項
function renderOptions(data) {
    data.forEach(zone => {
        const opt = document.createElement('option');
        opt.value = zone;
        opt.textContent = zone;
        select.appendChild(opt);
    });
}
// 用來驗證瀏覽器是否有支援CORS Request
function makeReq(method, url) {
    const xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
        xhr.open(method, url, true);
    } else {
        xhr = null;
    }
    return xhr;
}

xhr.send(null);
// back to top

function showToTop(e) {
    let scrollPosition = $(window).scrollTop();
    if (scrollPosition > scrollTrigger) {
        $('.toTop').addClass('show');
    } else {
        $('.toTop').removeClass('show');
    }
}

window.addEventListener('scroll', showToTop);

function returnToTop(e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: 0
    }, 800)
};

toTop.addEventListener('click', returnToTop)

// 渲染取得到的資料在content上
function renderData(e) {
    e.preventDefault();
    if (xhr.status == 200) {
        const responseText = JSON.parse(xhr.responseText);
        const data = responseText.result.records;
        let renderContent = '';
        content.firstElementChild.textContent = this.value;
        for (let i = 0; i < data.length; i++) {
            if (this.value === data[i].Zone) {
                let name = data[i].Name,
                    openTime = data[i].Opentime,
                    tel = data[i].Tel,
                    img = data[i].Picture1,
                    zone = data[i].Zone,
                    address = data[i].Add,
                    price = data[i].Ticketinfo;
                let spot = `
                    <div class="col-two">
                        <div class="img-zone" style="background-image: url(${img});">
                            <h3>${name}</h3>
                            <p>${zone}</p>
                        </div>
                        <ul class="detail">
                            <li>
                                <img src="imgs/icons_clock.png" alt="time"/>
                                <span>${openTime}</span>
                            </li>
                            <li>
                                <img src="imgs/icons_pin.png" alt="address"/>
                                <span>${address}</span>
                            </li>
                            <li>
                                <img src="imgs/icons_phone.png" alt="tel"/>
                                <span>${tel}</span>
                            </li>
                            <p><img src="imgs/icons_tag.png" alt="tel"/>${price}</p>
                        </ul>
                    </div>
                `;
                renderContent += spot;
            }
        }

        if (renderContent === '') {
            content.lastElementChild.innerHTML = `<p class="noData">查無資料</p>`;
            footer.className = '';
        } else {
            content.lastElementChild.innerHTML = renderContent;
            footer.className = 'show';
        }
    } else {
        alert('Sorry, our server have something wrong. Please try again.');
    }
}

// 點擊下拉式選單來渲染資料

function createOptionsListener() {
    const dropDownList = document.querySelector('#select-area');
    dropDownList.addEventListener('change', renderData);
}

// 點擊熱門區來渲染資料資料

const hotAreas = document.querySelectorAll('.hot button');

hotAreas.forEach(hotArea => hotArea.addEventListener('click', renderData));