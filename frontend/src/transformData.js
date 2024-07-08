// src/utils/transformData.js

export const transformSentencesToWordCloudData = (sentences) => {

    const stopwords = new Set([
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
        'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
        'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
        'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
        'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
        'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
        'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
        'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
        'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
        'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 
        'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 
        'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 
        'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 
        'don', 'should', 'now', 'would', 'recently', 'im', 'put', 'also', 'due', 'id', 'still',
        'get', 'say', 'ive', 'cant', 'make','pay', 'hours', 'youre', 'yeah', 'dont', 'much',
        'one','wouldnt', 'always', 'however', 'really', 'could', 'given', 'come', 'sometimes',
        'know', 'able', 'find', 'anything', 'need', 'many','day','overall','things','feels','day',
        'thing','area','often','part','share','definitely','something'


      ]);
      
  const wordCounts = sentences
    .join(' ')
    .split(/\s+/)
    .reduce((acc, word) => {
      const cleanedWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (cleanedWord && !stopwords.has(cleanedWord)) {
        acc[cleanedWord] = (acc[cleanedWord] || 0) + 1;
      }
      return acc;
    }, {});

  return Object.keys(wordCounts).map(word => ({
    text: word,
    value: wordCounts[word]
  }));
};
