import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firebase configuration

const AddLocationModal = ({ closeModal }) => {
  const [branch, setBranch] = useState('');
  const [price, setPrice] = useState('');
  const [pax, setPax] = useState('');

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'locations'), {
        branch,
        price,
        pax,
      });
      closeModal(); // Close modal after successful submission
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '400px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2>Add New Location</h2>
        <form onSubmit={handleAddLocation}>
          <div>
            <label>Branch:</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>Pax:</label>
            <input
              type="text"
              value={pax}
              onChange={(e) => setPax(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            Add Location
          </button>
          <button
            type="button"
            onClick={closeModal}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginTop: '10px',
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;
