import React from 'react'

const ModelCard = ( { model } ) => {
  return (
       <div className="card bg-base-100 w-96 shadow-sm transition ease-in-out duration-300 hover:scale-105">
  <figure>
    <img
      src={model.imageUrl}
      alt={model.name} />
  </figure>
  <div className="card-body">
    <h2 className="card-title">
      {model.name}
        {model.isNew && (
            <div className="badge badge-secondary">NEW</div>
        )}
    </h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div className="card-actions justify-end">
      {model.tags.map((model) => (
          <div className={`badge badge-soft m-1`}>{model}</div>
        ))}
    </div>
  </div>
</div>
  )
}

export default ModelCard