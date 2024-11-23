import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AddLocationModal = ({ closeModal }) => {
  const [branch, setBranch] = useState('');
  const [price, setPrice] = useState('');
  const [pax, setPax] = useState('');
  const [error, setError] = useState('');

  const handleAddLocation = async () => {
    if (!branch || !price || !pax) {
      setError('All fields are required.');
      return;
    }

    try {
      await addDoc(collection(db, 'locations'), {
        branch,
        price,
        pax,
      });
      closeModal(); // Close modal after successful addition
    } catch (err) {
      console.error('Error adding location:', err);
      setError('Failed to add location. Please try again.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '400px',
        }}
      >
        <h2>Add Location</h2>
        <div style={{ marginBottom: '10px' }}>
          <label>Branch:</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Pax:</label>
          <input
            type="number"
            value={pax}
            onChange={(e) => setPax(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          onClick={handleAddLocation}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer',
          }}
        >
          Add
        </button>
        <button
          onClick={closeModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddLocationModal;
