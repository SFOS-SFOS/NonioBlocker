// chrome.runtime.onInstalled.addListener(function () {
//     try {
//         let thisVersion = chrome.runtime.getManifest().version;
//         console.log("Version: ", thisVersion);
//         if (details.reason === "install") {
//             console.info("First version installed");
//             alert("Remover Nonio foi instalado pela primeira vez :)");
//             //Send message to popup.html and notify/alert user("Welcome")
//         } else if (details.reason === "update") {
//             console.info("Remover Nonio atializado para a versão: " + thisVersion);
//             //Send message to popup.html and notify/alert user
//
//             chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
//                 for (var i = 0; i < tabs.length; i++) {
//                     chrome.tabs.sendMessage(tabs[i].id, {name: "showPopupOnUpdated", version: thisVersion});
//                 }
//             });
//         }
//     } catch (e) {
//         console.info("OnInstall Error - " + e);
//     }
// });

let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

const isFirefox = typeof InstallTrigger !== 'undefined';

// Internet Explorer 6-11
const isIE = !!document.documentMode;
const isEdge = !isIE && !!window.StyleMedia;


if (isFirefox || isEdge) {

    // console.log("I'm other");

    isChrome = false;

    browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        if (changeInfo.status === "complete") {
            start(tab.url);
        }
    });

    browser.browserAction.onClicked.addListener(function (tab) {
        start(tab.url);
    })


} else if (isChrome) {

    // console.log("I'm Chrome");

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        if (changeInfo.status === "complete") {
            start(tab.url);
        }
    });


    chrome.browserAction.onClicked.addListener(function (tab) {
        start(tab.url);
    });


    chrome.tabs.onActivated.addListener(function (activeInfo) {
        chrome.tabs.get(activeInfo.tabId, function (tab) {
            start(tab.url);
        });

        // chrome.tabs.query({currentWindow: true}, function (tabs) {
        //     for (let i = 0; i < tabs.length; i++) {
        //         start(tabs[i].url);
        //     }
        // });
    });

}


function start(url) {

    if (url.substring(0, 4).toLowerCase() === "http") {

        let parser = document.createElement("a");
        parser.href = url;

        console.log("Host: ", parser.hostname);

        removeNonio(parser.hostname);
    }
}

function removeNonio(hostname) {

    switch (hostname) {

        case "www.publico.pt":
            removeClassNonio(["warning-nonio-overlay"]);
            break;

        case "www.jn.pt":
        case "www.ojogo.pt":
            removeClassNonio(["tp-modal", "tp-backdrop"]);
            break;

        case "www.dn.pt":
            removeClassNonio(["tp-modal", "tp-backdrop tp-active"]);
            break;

        case "www.aquelamaquina.pt":
        case "www.cmjornal.pt":
        case "www.classificadoscm.pt":
        case "www.flash.pt":
        case "www.maxima.pt":
        case "www.vidas.pt":
            removeParentClassIdNonio(["gatting_container"]);
            break;

        case "www.sabado.pt":
        case "www.jornaldenegocios.pt":
        case "www.record.pt":
            removeIdNonio(["layer_gattingLN8d9888cbd84302e0b435be46bd48b3fa", "layer_gattingLNeb6eb7e1f63306dc6c026d2c156f69e4"]);
            break;

        case "www.dinheirovivo.pt":
        case "www.motor24.pt":
        case "www.noticiasmagazine.pt":
        case "www.evasoes.pt":
        case "www.tsf.pt":
            removeIframeNonio();
            break;

        case "blitz.pt":
        case "expresso.pt":
            setIntervalX(function () {
                removeIdNonio(["imp-content-gate-root"]);
            }, 500, 50);
            break;

        case "autoportal.iol.pt":
        case "radiocomercial.iol.pt":
        case "tvi.iol.pt":
        case "tvi24.iol.pt":
        case "maisfutebol.iol.pt":
        case "selfie.iol.pt":
        case "smoothfm.iol.pt":
        case "cidade.iol.pt":
        case "m80.iol.pt":
        case "tviplayer.iol.pt":
            removeClassNonio(["nonioBox"]);
            break;

        case "rr.sapo.pt":
        case "rfm.sapo.pt":
        case "megahits.sapo.pt":
            removeParentClassIdNonio(["maskContentGatingNonio"]);
            removeIdNonio("gig_1572557683568_showScreenSet");
            break;

        case "sicmulher.pt":
            removeParentClassIdNonio(["_3uC1ta_PlzWRINX9igoXs- brand__sicmul"]);
            break;

        case "sicnoticias.pt":
            removeParentClassIdNonio(["_3uC1ta_PlzWRINX9igoXs- brand__sicnot"]);
            break;

        case "www.sic.pt":
        case "sic.pt":
        case "sicradical.pt":
        case "sickapa.pt":
        case "siccaras.pt":
            removeParentClassIdNonio(["_3uC1ta_PlzWRINX9igoXs- brand__sic"]);
            break;

        default:
            break;
    }
}


function removeParentClassIdNonio(elemName) {

    if (isChrome) {
        chrome.tabs.query({active: true, currentWindow: true}, function () {
            chrome.tabs.executeScript({
                code: 'document.getElementsByClassName("' + elemName + '")[0].parentElement.remove();'
            }, function () {
                catchChromeException();
            });
        });
    } else if (isFirefox) {
        browser.tabs.query({active: true, currentWindow: true}, function () {
            browser.tabs.executeScript({
                code: 'document.getElementsByClassName("' + elemName + '")[0].parentElement.remove();'
            });
        });
    }

    activateScrollBars();
}


function removeClass(elemName) {

    if (isChrome) {
        chrome.tabs.query({active: true, currentWindow: true}, function () {
            chrome.tabs.executeScript({
                code: 'document.getElementsByClassName("' + elemName + '")[0].remove();'
            }, function () {
                catchChromeException();
            });
        });
    } else if (isFirefox) {
        browser.tabs.query({active: true, currentWindow: true}, function () {
            browser.tabs.executeScript({
                code: 'document.getElementsByClassName("' + elemName + '")[0].remove();'
            });
        });
    }

    activateScrollBars();
}

function removeClassNonio(remArray) {
    for (let i = 0; i < remArray.length; i++) {
        try {
            removeClass(remArray[i]);
        } catch (error) {
            console.log("ERROR: ", error);
        }
    }
}

function removeIdNonio(remArray) {
    for (let i = 0; i < remArray.length; i++) {

        if (isChrome) {
            chrome.tabs.query({active: true, currentWindow: true}, function () {
                chrome.tabs.executeScript({
                    code: 'document.getElementById("' + remArray[i] + '").remove();'
                }, function () {
                    catchChromeException();
                });
            });
        } else if (isFirefox) {
            browser.tabs.query({active: true, currentWindow: true}, function () {
                browser.tabs.executeScript({
                    code: 'document.getElementById("' + remArray[i] + '").remove();'
                });
            });
        }

        activateScrollBars();
    }
}

function removeIframeNonio() {

    if (isChrome) {
        chrome.tabs.query({active: true, currentWindow: true}, function () {
            chrome.tabs.executeScript(null, {
                code: 'document.querySelectorAll("iframe").forEach(e => e.remove());'
            }, function () {
                catchChromeException();
            });
        });
    } else if (isFirefox) {
        browser.tabs.query({active: true, currentWindow: true}, function () {
            browser.tabs.executeScript(null, {
                code: 'document.querySelectorAll("iframe").forEach(e => e.remove());'
            });
        });
    }

    activateScrollBars();
}

function activateScrollBars() {

    if (isChrome) {
        chrome.tabs.executeScript({
            code:
                'document.getElementsByTagName("body")[0].style = "overflow:auto !important"; ' +
                'document.getElementsByTagName("html")[0].style = "overflow:auto !important";'
        }, function () {
            catchChromeException();
        });
    } else if (isFirefox) {
        browser.tabs.executeScript({
            code:
                'document.getElementsByTagName("body")[0].style = "overflow:auto !important"; ' +
                'document.getElementsByTagName("html")[0].style = "overflow:auto !important";'
        }, function (result) {

        });
    }
}

function setIntervalX(callback, delay, repetitions) {
    let i = 0;
    let interval = window.setInterval(function () {

        callback();

        if (++i === repetitions) {
            window.clearInterval(interval);
        }

    }, delay);
}

function catchChromeException() {
    let e = chrome.runtime.lastError;
    if (e !== undefined) {
        // console.log("Exception: ", e);
    }
}