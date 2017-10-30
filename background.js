if (browser.webRequest.onErrorOccurred.hasListener(tryAgain) == false ) {
        
    browser.webRequest.onErrorOccurred.addListener(
        tryAgain,
        {urls: ["<all_urls>"]}
    );
}

var timeoutIds = [];

function tryAgain(requestDetails)
{    
    if (requestDetails !== null && requestDetails !== undefined && requestDetails.type === "main_frame") {
        
        if (timeoutIds != null && timeoutIds != undefined) {
            
            var timeoutId = timeoutIds[requestDetails.tabId];
            if (timeoutId != null && timeoutId != undefined) {
                clearTimeout(timeoutId);
            }
        }
        
        console.log(`[MMTA] failed: ${requestDetails.url}`);
        
        var gettingItem = browser.storage.local.get('timeout');
        gettingItem.then((res) => {
            
            var timeout = res.timeout || 60;
            console.log("[MMTA] timeout = " + timeout);
            
            timeoutIds[requestDetails.tabId] = setTimeout(reload, timeout * 1000, requestDetails.tabId);
        }, onError);
    }
}

function reload(tabId)
{
    console.log("[MMTA] reloading");
    
    if (timeoutIds != null && timeoutIds != undefined) {
        
        var timeoutId = timeoutIds[tabId];
        if (timeoutId != null && timeoutId != undefined) {
            clearTimeout(timeoutId);
        }
    }
    
    if (tabId != null && tabId != undefined && tabId != -1 && tabId != browser.tabs.TAB_ID_NONE) {
    
        var reloading = browser.tabs.reload(tabId, {bypassCache: true});
        reloading.then(onReloaded, onError);
    }
    else {
        
        console.log("[MMTA] Error: tabId does not exist or is invalid");
    }
}

function onReloaded()
{
    console.log(`[MMTA] Reloaded`);
}

function onError(error)
{
    console.log(`[MMTA] ${error}`);
    
    if (browser.webRequest.onErrorOccurred.hasListener(tryAgain) == false ) {
        
        browser.webRequest.onErrorOccurred.addListener(
            tryAgain,
            {urls: ["<all_urls>"]}
        );
    }
}