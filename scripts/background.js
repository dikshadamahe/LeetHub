function handleMessage(request) {
  if (
    request &&
    request.closeWebPage === true &&
    request.isSuccess === true
  ) {
    /* Set username */
    chrome.storage.local.set(
      { leethub_username: request.username },
      () => {
        console.log('Set leethub_username successfully.');
      },
    );

    /* Set token */
    chrome.storage.local.set({ leethub_token: request.token }, () => {
      console.log('Set leethub_token successfully.');
    });

    /* Close pipe */
    chrome.storage.local.set({ pipe_leethub: false }, () => {
      console.log('Closed pipe.');
    });

    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs) {
        if (tabs && tabs[0]) {
          chrome.tabs.remove(tabs[0].id);
        }
      },
    );

    /* Go to onboarding for UX */
    const urlOnboarding = chrome.runtime.getURL('welcome.html');
    chrome.tabs.create({ url: urlOnboarding, active: true }); // creates new tab
  } else if (
    request &&
    request.closeWebPage === true &&
    request.isSuccess === false
  ) {
    /* Show notification since alerts are not supported in service workers */
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/thumbnail.png',
      title: 'LeetHub Authentication Failed',
      message:
        'Something went wrong while trying to authenticate your profile!',
    });
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs) {
        if (tabs && tabs[0]) {
          chrome.tabs.remove(tabs[0].id);
        }
      },
    );
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
