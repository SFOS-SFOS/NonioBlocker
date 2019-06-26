// https://gist.github.com/prasanthj/a5b71c47ee0dec3bbb72
// https://gist.github.com/jlong/2428561#file-uri-js


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


let tabID = null;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    // console.log("ID: ", tabId);
    // console.log("Info: ", changeInfo);
    // console.log("Tab: ", tab);

    if (changeInfo.status === "complete") {
        let url = tab.url;
        let parser = document.createElement("a");
        parser.href = url;

        // console.log("URL: ", url);
        // console.log("Parser: ", parser.hostname);

        // tabID = tab.index;
        // console.log("Index: ", tab.index);
        // console.log("Index2 : ", tab.id);

        removeNonio(parser.hostname);
    }

});


function removeNonio(hostname) {
    // console.log("Vou remover de ", hostname);

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
        case "www.jornaldenegocios.pt":
        case "www.maxima.pt":
        case "www.vidas.pt":
            removeParentClassIdNonio(["gatting_container"]);
            break;

        case "www.sabado.pt":
            removeParentClassIdNonio(["gatting_containerLN681a8ea163a8a8224a11839ad9e2b731"]);
            break;

        case "www.record.pt":
            removeParentClassIdNonio(["gatting_containerLN77d9bcae3d4b659b33972c248486698f"]);
            break;

        case "www.dinheirovivo.pt":
        case "www.motor24.pt":
        case "www.noticiasmagazine.pt":
        case "www.evasoes.pt":
        case "www.tsf.pt":
            removeIframesNonio();
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
            removeParentClassIdNonio(["maskContentGatingNonio"]);
            break;

        case "megahits.sapo.pt":
            removeParentClassIdNonio("maskContentGatingNonio");
            break;

        case "blitz.pt":
            removeIframesNonio();
            removeClassNonio(["_3uC1ta_PlzWRINX9igoXs- brand__blitz"]);
            break;

        case "www.sic.pt":
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
    }
}


function removeParentClassIdNonio(elemName) {
    chrome.tabs.query({active: true, currentWindow: true}, function () {
        chrome.tabs.executeScript({
            code: 'document.getElementsByClassName("' + elemName + '")[0].parentElement.remove();'
        });
        ativateScrolsBar();
    });
}


function removeClass(elemName) {
    chrome.tabs.query({active: true, currentWindow: true}, function () {
        chrome.tabs.executeScript({
            code: 'document.getElementsByClassName("' + elemName + '")[0].remove();'
        });
        ativateScrolsBar();
    });

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
        chrome.tabs.query({active: true, currentWindow: true}, function () {
            chrome.tabs.executeScript({
                code: 'document.getElementById("' + remArray[i] + '").remove();'
            });
            ativateScrolsBar();
        });
    }
}

function removeIframesNonio() {
    chrome.tabs.query({active: true, currentWindow: true}, function () {
        chrome.tabs.executeScript(null, {
            code: 'document.querySelectorAll("iframe").forEach(e => e.remove());'
        });
        ativateScrolsBar();
    });
}

function ativateScrolsBar() {
    chrome.tabs.executeScript({
        code:
            'document.getElementsByTagName("body")[0].style = "overflow:auto !important"; ' +
            'document.getElementsByTagName("html")[0].style = "overflow:auto !important";'
    });
}