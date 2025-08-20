import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Make sure to import the Firestore instance

import ModelCard from './ModelCard';

// This function now fetches data from Firestore
const getPortfolioItems = async () => {
  const querySnapshot = await getDocs(collection(db, "portfolioItems"));
  const items = [];
  querySnapshot.forEach((doc) => {
    // Add the document ID to the data object
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
};

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getPortfolioItems();
        setPortfolioItems(items);
      } catch (err) {
        console.error("Failed to fetch portfolio items:", err);
        setError("Failed to load portfolio items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []); // The empty dependency array ensures this effect runs once on mount

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className='m-10 mx-20'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((model) => (
          // The key prop is crucial for React to efficiently update the list
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;