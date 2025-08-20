import React from 'react'

import ModelCard from './ModelCard';

const models = [
  {
    id: 1,
    isNew: true,
    name: "Helmet",
    imageUrl: "/models/helmet.png",
    tags: ["casual", "outdoor", "hiking"],
  },
  {
    id: 2,
    name: "Plant",
    imageUrl: "/models/plant.png",
    tags: ["casual", "outdoor", "hiking"],
  },
  {
    id: 3,
    name: "Robot",
    imageUrl: "/models/robot.png",
    tags: ["casual", "outdoor", "hiking"],
  },
  {
    id: 4,
    name: "Helmet",
    imageUrl: "/models/helmet.png",
    tags: ["casual", "outdoor", "hiking"],
  },
];

const Portfolio = () => {
  return (
    <div className='m-10 mx-20'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          // The key prop is crucial for React to efficiently update the list
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  )
}

export default Portfolio