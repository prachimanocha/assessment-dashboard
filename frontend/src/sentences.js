// src/data/sentences.js

// src/data/sentences.js

const fetchSentences = async () => {
    const response = await fetch(`http://localhost:8000/public/index.php?data=comments`);
    const comments = await response.json();
    
    // return comments.map(comment => comment.trim());
    return Object.values(comments).map(comment => comment.trim());
  };
  

  // Immediately fetch and export the sentences array
  const sentences = await fetchSentences();
  
  export default sentences;
console.log(sentences);  

