function displayHistory() {
    const historyDiv = document.getElementById('history');

    if (historyDiv.textContent.trim() === "") {
        // Fetch and show the history
        fetch('history.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const listItem = document.createElement('p');
                    listItem.textContent = `Question: ${item.question}, Answer: ${item.answer}`;
                    historyDiv.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Oi! There was an error fetching the data:', error);
            });
    } else {
        // Clear the history
        historyDiv.textContent = "";
    }
}

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
            document.getElementById('history').textContent = ''; // display bhi clear kardi
        })
        .catch((err) => {
            console.error('Error clearing history:', err);
        });
}




function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}



