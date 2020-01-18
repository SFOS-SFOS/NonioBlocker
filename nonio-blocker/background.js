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
let isFirefox = typeof InstallTrigger !== 'undefined';

// Internet Explorer 6-11
let isIE = !!document.documentMode;
let isEdge = !isIE && !!window.StyleMedia;

const DEBUG = true;

if (isFirefox || isEdge) {

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

        removeAds(parser.hostname);
    }
}

function removeAds(hostname) {

    switch (hostname) {

        case "www.publico.pt":
            removeClass(["warning-nonio-overlay"]);
            break;

        case "www.jn.pt":
            removeClass(["tp-modal", "tp-backdrop"]);
            setIntervalX(function () {
                removeElementsByID(["template-container", "ng-app"]);
            }, 500, 10);
            break;

        case "www.ojogo.pt":
            removeClass(["tp-modal", "tp-backdrop"]);
            break;

        case "www.dn.pt":
            removeClass(["tp-modal", "tp-backdrop tp-active"]);
            break;

        case "www.aquelamaquina.pt":
        case "www.cmjornal.pt":
        case "www.classificadoscm.pt":
        case "www.flash.pt":
        case "www.maxima.pt":
        case "www.vidas.pt":
        case "www.cm-tv.pt":
            removeClassParent(["gatting_container"]);
            deleteCofinaExtra();
            deleteGDPRCookiesPopup();
            break;

        case "www.sabado.pt":
        case "www.jornaldenegocios.pt":
        case "www.record.pt":
            removeElementsGrandpaByID(["gatting_info"]);
            deleteCofinaExtra();
            deleteGDPRCookiesPopup();
            break;

        case "www.dinheirovivo.pt":
        case "www.motor24.pt":
        case "www.noticiasmagazine.pt":
        case "www.evasoes.pt":
        case "www.tsf.pt":
            removeNonioIframe();
            break;

        case "blitz.pt":
        case "expresso.pt":
            setIntervalX(function () {
                removeElementsByID(["imp-content-gate-root"]);
            }, 500, 10);
            deleteGDPRCookiesPopup();
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
            removeClass(["nonioBox"]);
            removeElementsByID(["wrapperContentGatingNonio"]);
            deleteGDPRCookiesPopup();
            break;

        case "rr.sapo.pt":
        case "rfm.sapo.pt":
        case "megahits.sapo.pt":
            removeClassParent(["maskContentGatingNonio"]);
            removeElementsParentByID(["gigya-screen-dialog-page-overlay"]);
            break;

        case "sicmulher.pt":
            removeClassParent(["_3uC1ta_PlzWRINX9igoXs- brand__sicmul"]);
            break;

        case "sicnoticias.pt":
            removeClassParent(["_3uC1ta_PlzWRINX9igoXs- brand__sicnot"]);
            break;

        case "www.sic.pt":
        case "sic.pt":
        case "sicradical.pt":
        case "sickapa.pt":
        case "siccaras.pt":
            removeClassParent(["_3uC1ta_PlzWRINX9igoXs- brand__sic"]);
            break;

        case "www.zerozero.pt":
            setIntervalX(function () {
                removeElementsByID(["ad_block_msg"]);
                removeClass("zz-tkvr");
                deleteGDPRCookiesPopup();
            }, 500, 10);

            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                if (DEBUG) {
                    console.log("Tabs: ", tabs);
                    console.log("Zerozero?: ", tabs[0].url);
                }
                if (tabs.length > 0) {
                    muteTab(tabs[0].id);
                }
            });
            break;

        case "www.symbolab.com":
            setIntervalX(function () {
                removeClassParent("tooltipster-box");
            }, 500, 20);
            break;

        case "contaspoupanca.pt":
            removeElementsByID(["newsletter-bt", "x", "spu-4164", "spu-bg-4164", "wow-modal-overlay-1", "onesignal-bell-container"]);
            break;


        default:
            if (hostname.endsWith("sapo.pt")) {
                deleteGDPRCookiesPopup();
            } else if (hostname.endsWith("facebook.com")) {
                removeClass("_5hn6");
            }
            break;
    }
}

function muteTab(tabID) {
    if (DEBUG) {
        chrome.tabs.update(tabID, {"muted": true}, function (tab) {
            console.log("New tab settings: ", tab);
        });
    } else {
        chrome.tabs.update(tabID, {"muted": true});
    }
}

function deleteCofinaExtra() {
    chrome.tabs.query({active: true, currentWindow: true}, function () {
        chrome.tabs.executeScript({
            code: 'document.getElementById("notificacao").remove();' +
                'document.getElementById("frmLogin").parentElement.parentElement.parentElement.remove();'
        }, function () {
            catchChromeException();
        });
    });
}

function removeClassParent(elemName) {

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


function removeClass(array) {

    for (let i = 0; i < array.length; i++) {
        try {
            if (isChrome) {
                chrome.tabs.query({active: true, currentWindow: true}, function () {
                    chrome.tabs.executeScript({
                        code: 'document.getElementsByClassName("' + array[i] + '")[0].remove();'
                    }, function () {
                        catchChromeException();
                    });
                });
            } else if (isFirefox) {
                browser.tabs.query({active: true, currentWindow: true}, function () {
                    browser.tabs.executeScript({
                        code: 'document.getElementsByClassName("' + array[i] + '")[0].remove();'
                    });
                });
            }
        } catch (error) {
            console.log("ERROR: ", error);
        }
    }

    activateScrollBars();
}

function removeElementsByID(array) {
    for (let i = 0; i < array.length; i++) {
        if (isChrome) {
            chrome.tabs.query({active: true, currentWindow: true}, function () {
                chrome.tabs.executeScript({
                    code: 'document.getElementById("' + array[i] + '").remove();'
                }, function () {
                    catchChromeException();
                });
            });
        } else if (isFirefox) {
            browser.tabs.query({active: true, currentWindow: true}, function () {
                browser.tabs.executeScript({
                    code: 'document.getElementById("' + array[i] + '").remove();'
                });
            });
        }
    }
    activateScrollBars();
}

function removeNonioIframe() {

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

function removeElementsParentByID(array) {
    for (let i = 0; i < array.length; i++) {
        chrome.tabs.query({active: true, currentWindow: true}, function () {
            chrome.tabs.executeScript({
                code: 'document.getElementById("' + array[i] + '").parentElement.remove();'
                // code: "try {" +
                //     "document.getElementById(\"' + array[i] + '\").parentElement.remove();" +
                //     "} catch (error) {" +
                //     "console.log(\"Error: \", error)" +
                //     "}"
            }, function (arrayOfResults) {
                if (arrayOfResults !== undefined && arrayOfResults.length > 0) {
                    if (DEBUG && arrayOfResults[0] != null) {
                        console.log("Result: ", arrayOfResults);
                    }
                }
                // console.log("Error in here: ", chrome.runtime);
            });
        });
    }
}

function removeElementsGrandpaByID(array) {
    for (let i = 0; i < array.length; i++) {
        chrome.tabs.query({active: true, currentWindow: true}, function () {
            chrome.tabs.executeScript({
                code: 'document.getElementsByClassName("' + array[i] + '")[0].parentElement.parentElement.remove();'
            }, function () {

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


function deleteGDPRCookiesPopup() {
    setIntervalX(function () {
        removeElementsParentByID(["qcCmpUi"]);
        activateScrollBars();
    }, 500, 10);
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