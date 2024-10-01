let historyVisible = false; // Track the visibility of the history
// Check for the saved dark mode preference on page load
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

// Function to toggle history visibility
function displayHistory() {
    const historyContainer = document.getElementById('historyContainer');

    // Toggle visibility
    historyVisible = !historyVisible; 
    historyContainer.style.display = historyVisible ? 'block' : 'none'; 

    if (historyVisible) {
        // If we're showing the history, fetch and display it
        fetch('history.json')
            .then(response => response.json())
            .then(data => {
                const historyList = document.getElementById('history');
                historyList.innerHTML = ""; // Clear existing history

                if (data.length === 0) {
                    const noHistoryItem = document.createElement('div');
                    noHistoryItem.className = 'history-item no-history';
                    noHistoryItem.textContent = "No history available.";
                    historyList.appendChild(noHistoryItem);
                } else {
                    data.forEach(item => {
                        const historyItem = document.createElement('div');
                        historyItem.className = 'history-item';
                        historyItem.innerHTML = `
                            <strong>Question:</strong> ${item.question}<br>
                            <strong>Answer:</strong> ${item.answer}
                        `;
                        historyList.appendChild(historyItem);
                    });
                }
            })
            .catch(error => {
                console.error('Oi! There was an error fetching the data:', error);
            });
    }
}

// Function to clear history
function clearHistory() {
    fetch('/clearHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((res) => res.json())
    .then((data) => {
        console.log('History cleared:', data.message);
        document.getElementById('history').innerHTML = ''; // Clear displayed history
    })
    .catch((err) => {
        console.error('Error clearing history:', err);
    });
}



function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save the current mode in localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}
