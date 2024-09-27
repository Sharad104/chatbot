import { GoogleGenerativeAI } from "@google/generative-ai";
// import { marked } from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'; 
// marked for handling markdown

const API_KEY = "AIzaSyBviF2SXR0CCARjZmm7EXG-PBAJkOlLpGA";

async function generateText(userQuery) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = userQuery;
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    document.getElementById('output').innerText = responseText;
    saveHistory(userQuery, responseText);


  } catch (err) {
    console.error("error aagya bhenchod console pe", err);
    document.getElementById('output').innerText = "error aagya bhenchod";
  }
}

function saveHistory(question, answer) {
  const historyEntry = { question, answer };

  /*  # POST REQUEST {through form dete hain wase toh but yahn nhi dere for simplicity}
  shaiv jab bhi hum post request dete hain 
  tab vo post request express server ke pass haiendpoint pe aati hai 
  
  app.post(/sendhistory,(req,res)=>{
    const history = req.body; --> isko hum append kardege 
  })
  */

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
