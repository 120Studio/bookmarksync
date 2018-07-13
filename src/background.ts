import StorageUtil from './util/StorageUtil'
import DriveSync from './DriveSync'

declare var gapi;
let drive: DriveSync;
let startToken: string;

chrome.runtime.onInstalled.addListener(function () {

});

chrome.runtime.onMessage.addListener(function (message, callback) {

});


async function polling() {
  console.log('polling');
  //let changes = await drive.listChanges(startToken);
  let files = await drive.tree();
  console.log(files)
  setTimeout(polling, 1000 * 30);
}

chrome.identity.getAuthToken({ interactive: true }, function (token) {
  console.log(token);
  gapi.load('client', function () {
    gapi.client.setToken({ access_token: token });
    gapi.client.load('drive', 'v3', async () => {
      drive = new DriveSync(gapi.client.drive)
      startToken = await StorageUtil.getStartToken()
      if (!startToken) {
        startToken = await drive.getStartPageToken()
      }

      polling();
    })
  })
});
