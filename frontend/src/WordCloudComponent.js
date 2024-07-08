// src/components/WordCloudComponent.js

import React from 'react';
import WordCloud from 'react-wordcloud';

const WordCloudComponent = ({ data }) => {
  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [10, 60]
  };

  return (
    <div style={{ marginTop:'50px', height: 400, width: '100%' }}>
      <WordCloud options={options} words={data} />
    </div>
  );
};

export default WordCloudComponent;
