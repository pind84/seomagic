// Saves options to chrome.storage
function save_options() {
  var fontsize = document.getElementById('fontsize').value;
  var linksbox = document.getElementById('linksbox').value;
  chrome.storage.sync.set({
    fontsize: fontsize,
    linksbox: linksbox
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Изменения сохранены.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function default_options() {

  if (!confirm("Уверены что хотите вернуть настройки по умолчанию?")) return false;

    chrome.storage.sync.clear(function(items) {
      chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() { });
    });
  });

}


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {

  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    fontsize: '16',
    linksbox: ''
  }, function(items) {
    document.getElementById('fontsize').value = items.fontsize;
    document.getElementById('linksbox').value = items.linksbox;
  });
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('default').addEventListener('click',
    default_options);



