import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyBviF2SXR0CCARjZmm7EXG-PBAJkOlLpGA";

async function generateText(userQuery) {
  try {
    // Show the loading indicator
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('output').innerHTML = ''; // Clear previous output

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = userQuery;
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // Use the `marked` library to convert markdown to HTML
    const renderedMarkdown = marked.parse(responseText);
    document.getElementById('output').innerHTML = renderedMarkdown;
    saveHistory(userQuery, renderedMarkdown);
  } catch (err) {
    console.error("error aagya bhenchod console pe", err);
    document.getElementById('output').innerText = "error aagya bhenchod";
  } finally {
    // Hide the loading indicator
    document.getElementById('loadingIndicator').style.display = 'none';
  }
}


function saveHistory(question, answer) {
  const historyEntry = { question, answer };

  fetch('/saveHistory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(historyEntry),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('History saved:', data.message);
    })
    .catch((err) => {
      console.error('Error saving history:', err);
    });
}

document.getElementById('submitBtn').addEventListener('click', function () {
  const userInput = document.getElementById('userInput').value;
  if (userInput) {
    generateText(userInput);
  } else {
    document.getElementById('output').innerText = "Please enter a query.";
  }
});
