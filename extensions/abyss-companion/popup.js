document.addEventListener('DOMContentLoaded', () => {
  const notesArea = document.getElementById('notes');
  const openAppBtn = document.getElementById('open-app');

  // Load existing notes
  chrome.storage.local.get(['missionNotes'], (result) => {
    if (result.missionNotes) {
      notesArea.value = result.missionNotes;
    }
  });

  // Save notes on input
  notesArea.addEventListener('input', (e) => {
    const notes = e.target.value;
    chrome.storage.local.set({ missionNotes: notes });
  });

  // Open the main app
  openAppBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
  });
});
