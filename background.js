if (browser.webRequest.onErrorOccurred.hasListener(tryAgain) == false ) {
        
    browser.webRequest.onErrorOccurred.addListener(
        tryAgain,
        {urls: ["<all_urls>"],
        types: ["main_frame"]}
    );
}

var timeoutIds = [];
var errorsToReactUpon = {};
errorsToReactUpon["NS_ERROR_MALFORMED_URI"] = true;
errorsToReactUpon["NS_ERROR_CONNECTION_REFUSED"] = true;
errorsToReactUpon["NS_ERROR_NET_TIMEOUT"] = true;
errorsToReactUpon["NS_ERROR_OFFLINE"] = true;
errorsToReactUpon["NS_ERROR_PORT_ACCESS_NOT_ALLOWED"] = true;
errorsToReactUpon["NS_ERROR_NET_RESET"] = true;
errorsToReactUpon["NS_ERROR_INVALID_CONTENT_ENCODING"] = true;
errorsToReactUpon["NS_ERROR_UNKNOWN_HOST"] = true;
errorsToReactUpon["NS_ERROR_REDIRECT_LOOP"] = true;
errorsToReactUpon["NS_ERROR_ENTITY_CHANGED"] = true;
errorsToReactUpon["NS_ERROR_SOCKET_CREATE_FAILED"] = true;
errorsToReactUpon["NS_ERROR_NET_INTERRUPT"] = true;
errorsToReactUpon["NS_ERROR_PROXY_CONNECTION_REFUSED"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_RESOLVING"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_RESOLVED"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_CONNECTING_TO"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_CONNECTED_TO"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_SENDING_TO"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_WAITING_FOR"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_RECEIVING_FROM"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_REQUEST_HEADER"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_REQUEST_BODY_SENT"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_RESPONSE_START"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_RESPONSE_HEADER"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_RESPONSE_COMPLETE"] = true;
errorsToReactUpon["NS_ERROR_NET_ON_TRANSACTION_CLOSE"] = true;

function tryAgain(requestDetails)
{    
    if (requestDetails !== null && requestDetails !== undefined) {
        
        if (errorsToReactUpon[requestDetails.error] === true) {
            
            if (timeoutIds != null && timeoutIds != undefined) {
            
                var timeoutId = timeoutIds[requestDetails.tabId];
                if (timeoutId != null && timeoutId != undefined) {
                    clearTimeout(timeoutId);
                }
            }

            console.log(`[MMTA] failed: ${requestDetails.url} -> ${requestDetails.error}`);

            var gettingItem = browser.storage.local.get('timeout');
            gettingItem.then((res) => {

                var timeout = res.timeout || 60;
                console.log("[MMTA] timeout = " + timeout);

                timeoutIds[requestDetails.tabId] = setTimeout(reload, timeout * 1000, requestDetails.tabId);
            }, onError);
        }
        else {
            
            console.log(`[MMTA] not reacting upon error code ${requestDetails.error} for URL ${requestDetails.url}`);
        }
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