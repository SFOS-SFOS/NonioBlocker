// https://gist.github.com/prasanthj/a5b71c47ee0dec3bbb72
// https://gist.github.com/jlong/2428561#file-uri-js
// https://stackoverflow.com/a/9851769 browser detection


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


if (isFirefox || isEdge) {

    console.log("I'm other");

    isChrome = false;

    browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        // console.log("ID: ", tabId);
        // console.log("Info: ", changeInfo);
        // console.log("Tab: ", tab);

        if (changeInfo.status === "complete") {
            start(tab.url);
        }
    });

    browser.browserAction.onClicked.addListener(function (tab) {
        start(tab.url);
    })


} else if (isChrome) {

    console.log("I'm Chrome");

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        if (changeInfo.status === "complete") {
            start(tab.url);
        }
    });


    chrome.browserAction.onClicked.addListener(function (tab) {

        // console.log("Tab: ", tab);
        start(tab.url);

        // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        //     start(tabs[0].url);
        // });

    });

}


function start(url) {
    let parser = document.createElement("a");
    parser.href = url;

    // console.log("Parser: ", parser.hostname);

    removeNonio(parser.hostname);
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
        case "www.record.pt":
        case "www.jornaldenegocios.pt":
            removeIdNonio(["layer_gattingLN77d9bcae3d4b659b33972c248486698f"]);
            break;

        case "www.dinheirovivo.pt":
        case "www.motor24.pt":
        case "www.noticiasmagazine.pt":
        case "www.evasoes.pt":
        case "www.tsf.pt":
            removeIframeNonio();
            break;

        case "expresso.pt":
            removeIdNonio(["imp-content-gate-root"]);
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
            break;

        case "blitz.pt":
            removeIdNonio(["imp-content-gate-root"]);

            /* alternative */
            // removeClassNonio(["_3uC1ta_PlzWRINX9igoXs- brand__blitz"]);
            break;

        case "www.sic.pt":
        case "sic.pt":
        case "sicradical.pt":
        case "sickapa.pt":
        case "siccaras.pt":
            removeParentClassIdNonio(["_3uC1ta_PlzWRINX9igoXs- brand__sic"]);
            break;

        case "sicmulher.pt":
            removeParentClassIdNonio(["_3uC1ta_PlzWRINX9igoXs- brand__sicmul"]);
            break;

        case "sicnoticias.pt":
            removeParentClassIdNonio(["_3uC1ta_PlzWRINX9igoXs- brand__sicnot"]);
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
                'console.log("Aqui scroll"); ' +
                'document.getElementsByTagName("body")[0].style = "overflow:auto !important"; ' +
                'document.getElementsByTagName("html")[0].style = "overflow:auto !important";'
        }, function (result) {
            console.log("Result: ", result);
        });
    } else if (isFirefox) {
        browser.tabs.executeScript({
            code:
                'console.log("Aqui scroll"); ' +
                'document.getElementsByTagName("body")[0].style = "overflow:auto !important"; ' +
                'document.getElementsByTagName("html")[0].style = "overflow:auto !important";'
        }, function (result) {
            console.log("Result: ", result);
        });
    }
}
