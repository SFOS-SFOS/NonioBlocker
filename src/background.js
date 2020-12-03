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
    });

    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            // console.log("URL:\t" + details.url);
            if (details.url.indexOf("publico.pt") > -1) {
                if (details.url.indexOf("js/scrolldepth.min.js") > -1 || details.url.indexOf("js/site.min.js") > -1 || details.url.indexOf("cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js") > -1) {
                    return {cancel: true};
                }
            }
            return {cancel: false};
        },
        {
            urls: ["*://www.publico.pt/*"]
        },
        ["blocking"]
    );

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

    deleteGDPRCookiesPopup();

    switch (hostname) {

        case "thetvdb.com":
            activateScrollBars();
            break;

        case "www.sapo.pt":
            removeClass(["double-vertical-space", "adb-inline-warning", "hide-medium bottom-space"], false);
            setIntervalX(function () {
                chrome.tabs.query({active: true, currentWindow: true}, function () {
                    chrome.tabs.executeScript({
                        code: 'document.getElementsByClassName("hide-xlarge")[2].remove(); '
                    }, function () {
                        catchChromeException();
                    });
                });
            }, 500, 10);
            break;

        case "www.publico.pt":
            removeClass(["warning-nonio-overlay"], true);
            break;

        case "www.jn.pt":
            removeClass(["tp-modal", "tp-backdrop", "fc-ab-root"], true);
            // removeElementsParentByID(["qc-cmp2-ui"]);
            // setIntervalX(function () {
            //     removeElementsByID(["template-container", "ng-app"]);
            // }, 500, 10);
            break;

        case "www.ojogo.pt":
            removeClass(["tp-modal", "tp-backdrop"], true);
            break;

        case "www.dn.pt":
            removeClass(["tp-modal", "tp-backdrop tp-active"], true);
            break;

        case "www.aquelamaquina.pt":
        case "www.cmjornal.pt":
        case "www.classificadoscm.pt":
        case "www.flash.pt":
        case "www.maxima.pt":
        case "www.vidas.pt":
        case "www.cm-tv.pt":
            removeClassParent("gatting_container");
            removeElementsGrandpaByID(["gatting_info"]);
            deleteCofinaExtra();
            break;

        case "www.abola.pt":
        case "www.sabado.pt":
        case "www.jornaldenegocios.pt":
        case "www.record.pt":
            removeElementsGrandpaByID(["gatting_info"]);
            deleteCofinaExtra();
            break;

        case "www.dinheirovivo.pt":
        case "www.motor24.pt":
        case "www.noticiasmagazine.pt":
        case "www.evasoes.pt":
        case "www.tsf.pt":
            removeNonioIframe();
            removeClass(["fc-ab-root"], true);
            break;

        case "blitz.pt":
        case "expresso.pt":
            setIntervalX(() => removeElementsByID(["imp-content-gate-root"]), 500, 10);
            activateScrollBars();
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
            removeClass(["nonioBox"], true);
            removeElementsByID(["wrapperContentGatingNonio"]);
            break;

        case "rr.sapo.pt":
        case "rfm.sapo.pt":
        case "megahits.sapo.pt":
            removeClassParent("maskContentGatingNonio");
            removeElementsParentByID(["gigya-screen-dialog-page-overlay"]);
            break;

        case "sicmulher.pt":
            removeClassParent("_3uC1ta_PlzWRINX9igoXs- brand__sicmul");
            break;

        case "sicnoticias.pt":
            removeClassParent("_3uC1ta_PlzWRINX9igoXs- brand__sicnot");
            break;

        case "www.sic.pt":
        case "sic.pt":
        case "sicradical.pt":
        case "sickapa.pt":
        case "siccaras.pt":
            removeClassParent("_3uC1ta_PlzWRINX9igoXs- brand__sic");
            break;

        case "www.zerozero.pt":
            setIntervalX(function () {
                removeElementsByID(["ad_block_msg"]);
                removeClass(["zz-tkvr"], true);
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
            setIntervalX(() => removeClassParent("tooltipster-box"), 500, 20);
            break;

        case "contaspoupanca.pt":
            removeElementsByID(["newsletter-bt", "x", "spu-4164", "spu-bg-4164", "wow-modal-overlay-1", "onesignal-bell-container"]);
            break;

        case "www.noticiasaominuto.com":
        case "observador.pt":
        case "nit.pt":
            activateScrollBars();
            removeClass(["fc-ab-root"]);
            break;

        case "outlook.live.com":
            chrome.tabs.query({active: true, currentWindow: true}, function () {
                chrome.tabs.executeScript({
                    code: 'document.getElementsByClassName("_3_hHr3kfEhbNYRFM5YJxH9")[0].style.width = 0;' +
                        'document.getElementsByClassName("_2F6rWwLisyawGGg32JOcop")[0].style.width = 0;' +
                        'document.getElementsByClassName("_2F6rWwLisyawGGg32JOcop")[0].style.height = 0;' +
                        'document.getElementsByClassName("_3_hHr3kfEhbNYRFM5YJxH9")[1].remove();'
                }, function () {
                    catchChromeException();
                });
            });
            break;

        case "medium.com":
            removeClassParent("branch-journeys-top");
            removeElementsGrandpaByID(["branch-journeys-top"]);
            removeClass(["tx", "td"], true);
            break;

        case "jornaleconomico.sapo.pt":
            removeElementsParentByID(["cookieconsent:desc"]);
            break;

        case "www.msn.com":
            removeClass(["optanon-alert-box-wrapper"], true);
            break;

        case "www.castroelectronica.pt":
            removeClass(["privy-s2w-animate-in"], true);
            break;

        case "www.rtp.pt":
            setIntervalX(() => removeElementsByID(["rtpprivacycontent"]), 1000, 5);
            break;

        case "www.nytimes.com":
            chrome.tabs.query({active: true, currentWindow: true}, function () {
                chrome.tabs.executeScript({
                    code: 'document.getElementsByClassName("css-1qw5f1g")[0].click();'
                });
            });
            chrome.tabs.query({active: true, currentWindow: true}, function () {
                chrome.tabs.executeScript({
                    code: 'document.getElementById("standalone-footer").remove(); ' +
                        'document.getElementById("site-content").style="overflow:auto !important";'
                });
            });

            setIntervalX(function () {
                chrome.tabs.query({active: true, currentWindow: true}, function () {
                    chrome.tabs.executeScript({
                        code: 'document.getElementsByClassName("css-1bd8bfl")[0].remove(); ' +
                            'document.getElementById("gateway-content").remove(); ' +
                            'document.getElementsByClassName("css-mcm29f")[0].style = "overflow:auto !important"; ' +
                            'document.getElementsByClassName("undefined")[0].remove(); '
                    });
                });
            }, 1000, 5);
            break;


        default:
            if (hostname.endsWith("facebook.com")) {
                // removeClass(["_5hn6", "_3qw"], false);
                setIntervalX(() => removeClass(["_5hn6"], false), 1000, 5);
                removeElementsByID(["u_0_5x", "u_jsonp_3_65", "u_0_6r"], false);
                chrome.tabs.query({active: true, currentWindow: true}, function () {
                    chrome.tabs.executeScript({
                        code: 'document.getElementById("u_0_6").classList = "_li"; ' +
                            'document.getElementsByClassName("_59s7")[0].parentElement.remove(); '
                    });
                });
            } else if (hostname.indexOf("google") > -1) {
                if (hostname.indexOf("support") < 0) {
                    removeElementsByID(["consent-bump"]);
                    // removeElementsByID(["lb"]);
                    removeClass(["gb_7"]);
                    // removeClassParent(["m114nf"]);
                    // activateScrollBars();
                    // removeElementsByID(["lb"], false);
                    chrome.tabs.executeScript({
                        code: 'document.getElementsByTagName("html")[0].style = "overflow:auto !important"; ' +
                            'document.getElementById("lb").childNodes.forEach((value, key, map) => value.remove()) '
                    });
                }
            } else if (hostname.endsWith("youtube.com")) {

                setIntervalX(function () {
                    // removeElementsByID(["lb", "consent-bump"]);
                    removeElementsByID(["consent-bump"]);
                    removeClass(["ytd-popup-container"], false);


                    // code: 'if (document.getElementById("lb") !== null) {\n' +
                    //     '    console.log("Here 1\\n");\n' +
                    //     '    document.getElementById("lb").remove();\n' +
                    //     '}\n' +
                    //     'if (document.getElementById("consent-bump") !== null) {\n' +
                    //     '    document.getElementById("consent-bump").remove();\n' +
                    //     '    console.log("Here 2\\n");\n' +
                    //     '}\n' +
                    //     'if (document.getElementsByClassName("ytd-popup-container").length > 0) {\n' +
                    //     '    document.getElementsByClassName("ytd-popup-container")[0].remove();\n' +
                    //     '    console.log("Here 3\\n");\n' +
                    //     '}\n' +
                    //     'let _interval = setInterval(function () {\n' +
                    //     'console.log("estou aqui");' +
                    //     '    if (document.getElementsByClassName("ytp-play-button ytp-button")[0].title.indexOf("Reproduzir (k)") > -1) {\n' +
                    //     '        document.getElementsByClassName("ytp-play-button ytp-button")[0].click();\n' +
                    //     '        clearInterval(_interval);\n' +
                    //     '    }\n' +
                    //     '}, 1000);\n'
                    // });
                    /*
                                            if (array.length > 0) {
                                                // console.log("Tab URL:\t" + array[0].url);
                                                if (!array[0].url.endsWith("youtube.com/")) {
                                                    chrome.tabs.executeScript({
                                                        code: 'if (document.getElementsByClassName("ytp-play-button ytp-button")[0].title.indexOf("Reproduzir (k)") > -1 ) {\n' +
                                                            '    document.getElementsByClassName("ytp-play-button ytp-button")[0].click();\n' +
                                                            '}'
                                                    });
                                                }
                                            }
                    */

                }, 1000, 20);

                chrome.tabs.query({active: true, currentWindow: true}, function (array) {

                    chrome.tabs.executeScript({
                        code: 'try {\n' +
                            '    let i = 0;\n' +
                            '    const repetitions = 20;\n' +
                            '    let _interval = setInterval(function() {\n' +
                            '      //  console.log("estou aqui");\n' +
                            '      //  console.log("Título: \\t", document.getElementsByClassName("ytp-play-button ytp-button")[0].title);\n' +
                            '        if (document.getElementById("lb") !== null) {\n' +
                            '            console.log("Here 1");\n' +
                            '            document.getElementById("lb").remove();\n' +
                            '        }\n' +
                            '        if (document.getElementById("consent-bump") !== null) {\n' +
                            '            document.getElementById("consent-bump").remove();\n' +
                            '            console.log("Here 2");\n' +
                            '        }\n' +
                            '        if (document.getElementsByClassName("ytd-popup-container").length > 0) {\n' +
                            '            document.getElementsByClassName("ytd-popup-container")[0].remove();\n' +
                            '            console.log("Here 3");\n' +
                            '        }\n' +
                            '        if (window.location.href.indexOf("watch") > -1) {\n' +
                            '            if (document.getElementsByClassName("ytp-play-button ytp-button")[0].title.indexOf("Reproduzir (k)") > -1) {\n' +
                            '                document.getElementsByClassName("ytp-play-button ytp-button")[0].click();\n' +
                            '                window.clearInterval(_interval);\n' +
                            '            }\n' +
                            '        } else {\n' +
                            '            if (document.getElementsByClassName("ytp-play-button ytp-button")[0].title.indexOf("Pausa (k)") > -1) {\n' +
                            '                document.getElementsByClassName("ytp-play-button ytp-button")[0].click();\n' +
                            '                window.clearInterval(_interval);\n' +
                            '            }\n' +
                            '        }\n' +
                            '\n' +
                            '        if (++i === repetitions) {\n' +
                            '            window.clearInterval(_interval);\n' +
                            '        }\n' +
                            '\n' +
                            '    }, 1000);\n' +
                            '} catch (error) {\n' +
                            '    console.log("The error:\\\\t", error);\n' +
                            '}'
                    });
                });

            } else if (hostname.endsWith("meo.pt")) {
                removeElementsByID(["warning_EU_cookiemsg"]);
            } else if (hostname.endsWith("onlinesoccermanager.com")) {
                removeElementsByID(["advertisement-leaderboard-container"]);
                removeClass(["col-h-xs-11"], true);
                setIntervalX(function () {
                    removeClass(["anti-adblocker-warning"], true);
                    chrome.tabs.query({active: true, currentWindow: true}, function () {
                        chrome.tabs.executeScript({
                            code: 'document.getElementsByClassName("col-xs-12 col-h-md-24 col-sm-8 col-lg-9")[0].style.width = "100%"; ' +
                                'document.getElementsByClassName("hidden-xs col-sm-4 col-lg-3 col-h-md-24")[0].remove();'
                        })
                    });
                }, 500, 10);
            } else if (hostname.endsWith("pdfill.com")) {
                chrome.tabs.query({active: true, currentWindow: true}, function (tabResult) {
                    chrome.tabs.remove(tabResult[0].id);
                });
            } else if (hostname.endsWith("fandom.com")) {
                removeClass(["_1MLS_xjiUjam_u2qmURY4i"], true);
            } else if (hostname.endsWith("sapo.pt")) {
                setIntervalX(function () {
                    chrome.tabs.query({active: true, currentWindow: true}, function () {
                        chrome.tabs.executeScript({
                            code: 'try {\n' +
                                '    new Map(Object.entries(document.getElementsByClassName("adb-inline-warning")))\n' +
                                '        .forEach(function(value, key, map) {\n' +
                                '            value.parentElement.remove()\n' +
                                '        });\n' +
                                '} catch (error) {\n' +
                                '    console.log("The error:\\t", error);\n' +
                                '}'
                        });
                    });
                }, 1000, 5);
            } else if (hostname.toString().indexOf("sci-hub") > -1) {
                if (isChrome) {
                    console.log("Entrei 2\n");
                    chrome.tabs.query({active: true, currentWindow: true}, function () {
                        chrome.tabs.executeScript({
                            code: 'document.getElementById("menu").remove(); ' +
                                'document.getElementById("article").style.marginLeft = 0;'
                        });
                    });
                } else {
                    browser.tabs.query({active: true, currentWindow: true}, function () {
                        browser.tabs.executeScript({
                            code: 'document.getElementById("menu").remove(); ' +
                                'document.getElementById("article").style.marginLeft = 0;'
                        });
                    });
                }
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


function removeClass(array, addScrollBar) {

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

    if (addScrollBar) {
        activateScrollBars();
    }
}

function removeElementsByID(array, addScrollBar) {
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
    if (addScrollBar) {
        activateScrollBars();
    }
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
                code: "try {\n" +
                    "document.getElementById(\"" + array[i] + "\").parentElement.remove();\n" +
                    "} catch (error) {\n" +
                    "// console.log(\"Error: \", error)\n" +
                    "}\n"
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
    setIntervalX(() => removeElementsParentByID(["qcCmpUi", "qc-cmp2-ui"]), 500, 10);
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
