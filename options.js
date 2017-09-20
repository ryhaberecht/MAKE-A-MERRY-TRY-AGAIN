function saveOptions(e)
{
    var timeout = Number.parseInt(document.querySelector("#timeout").value);
    
    if (Number.isNaN(timeout) == true) { // parsing the int failed
        
        timeout = 60;
    }
    
    browser.storage.local.set({
        timeout: timeout
    });
    
    e.preventDefault(); // prevents default error handler to fire
}

function restoreOptions()
{
  var gettingItem = browser.storage.local.get('timeout');
  gettingItem.then((res) => {
    document.querySelector("#timeout").value = res.timeout || 60;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);