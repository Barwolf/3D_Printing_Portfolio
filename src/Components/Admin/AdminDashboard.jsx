import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModel, setNewModel] = useState({
    name: '',
    imageUrl: '',
    tags: '',
    isNew: false,
  });
  const [editingModel, setEditingModel] = useState(null);
  const [formError, setFormError] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/admin-login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Real-time Firestore listener for portfolio items
  useEffect(() => {
    // Only subscribe to Firestore if the user is authenticated
    if (user) {
      const unsubscribe = onSnapshot(collection(db, 'portfolioItems'), (snapshot) => {
        const items = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        setPortfolioItems(items);
        setLoading(false);
      }, (error) => {
        console.error('Failed to fetch portfolio items:', error);
        setLoading(false);
      });
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [user]);

  // Handles adding a new model to Firestore
  const handleAddModel = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      await addDoc(collection(db, 'portfolioItems'), {
        name: newModel.name,
        imageUrl: newModel.imageUrl,
        tags: newModel.tags.split(',').map(tag => tag.trim()), // Converts comma-separated string to an array
        isNew: newModel.isNew,
      });
      // Reset form fields after successful submission
      setNewModel({ name: '', imageUrl: '', tags: '', isNew: false });
      // Close the modal
      document.getElementById('add_model_modal').close();
    } catch (error) {
      console.error('Error adding document: ', error);
      setFormError('Failed to add model. Please try again.');
    }
  };

  // Handles updating an existing model in Firestore
  const handleEditModel = async (e) => {
    e.preventDefault();
    if (!editingModel || !editingModel.id) return;
    setFormError('');

    try {
      const docRef = doc(db, 'portfolioItems', editingModel.id);
      await updateDoc(docRef, {
        name: editingModel.name,
        imageUrl: editingModel.imageUrl,
        tags: editingModel.tags.split(',').map(tag => tag.trim()),
        isNew: editingModel.isNew,
      });
      setEditingModel(null); // Reset the editing state
      document.getElementById('edit_model_modal').close();
    } catch (error) {
      console.error('Error updating document: ', error);
      setFormError('Failed to update model. Please try again.');
    }
  };

  // Handles deleting a model from Firestore
  const handleDeleteModel = async () => {
    if (!itemToDelete) return;

    try {
      const docId = String(itemToDelete);
      
      await deleteDoc(doc(db, 'portfolioItems', docId));
      console.log(`Document with ID: ${docId} deleted successfully.`);
      
    } catch (error) {
      console.error('Error removing document: ', error);
    } finally {
      document.getElementById('confirm_delete_modal').close();
      setItemToDelete(null);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 lg:p-20">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add New Model Button */}
      <div className="flex justify-end mb-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            setNewModel({ name: '', imageUrl: '', tags: '', isNew: false });
            document.getElementById('add_model_modal').showModal();
          }}
        >
          Add New Model
        </button>
      </div>

      {/* Portfolio Items Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="table w-full">
          {/* Table Head */}
          <thead>
            <tr className="bg-base-200">
              <th className="w-1/12">Image</th>
              <th className="w-2/12">Name</th>
              <th className="w-4/12">Tags</th>
              <th className="w-1/12">Status</th>
              <th className="w-2/12">Actions</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {portfolioItems.map((model) => (
              <tr key={model.id}>
                <td>
                  <div className="mask mask-squircle h-12 w-12">
                    <img src={model.imageUrl} alt={`Image of ${model.name}`} />
                  </div>
                </td>
                <td>{model.name}</td>
                <td>
                  {model.tags && Array.isArray(model.tags) && model.tags.map((tag, index) => (
                    <span key={index} className="badge badge-ghost badge-sm mr-1">
                      {tag}
                    </span>
                  ))}
                </td>
                <td>
                  {model.isNew && <div className="badge badge-secondary">NEW</div>}
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-info btn-sm text-white"
                      onClick={() => {
                        // Set the editing model's data, including its ID
                        setEditingModel({ ...model, tags: Array.isArray(model.tags) ? model.tags.join(', ') : model.tags });
                        document.getElementById('edit_model_modal').showModal();
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        setItemToDelete(model.id);
                        document.getElementById('confirm_delete_modal').showModal();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Model Modal */}
      <dialog id="add_model_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Model</h3>
          <form className="py-4" onSubmit={handleAddModel}>
            {/* Name Input */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Model Name"
                className="input input-bordered w-full"
                value={newModel.name}
                onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                required
              />
            </div>

            {/* Image URL Input */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="text"
                placeholder="https://..."
                className="input input-bordered w-full"
                value={newModel.imageUrl}
                onChange={(e) => setNewModel({ ...newModel, imageUrl: e.target.value })}
                required
              />
            </div>

            {/* Tags Input */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Tags (comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., sci-fi, helmet, concept"
                className="input input-bordered w-full"
                value={newModel.tags}
                onChange={(e) => setNewModel({ ...newModel, tags: e.target.value })}
              />
            </div>

            {/* "Is New" Checkbox */}
            <div className="form-control mb-4">
              <label className="label cursor-pointer">
                <span className="label-text">Mark as New</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={newModel.isNew}
                  onChange={(e) => setNewModel({ ...newModel, isNew: e.target.checked })}
                />
              </label>
            </div>

            {formError && (
              <p className="text-red-500 text-sm mb-4">{formError}</p>
            )}

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Add Model
              </button>
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </form>
        </div>
      </dialog>

      {/* Edit Model Modal */}
      {editingModel && (
        <dialog id="edit_model_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Model</h3>
            <form className="py-4" onSubmit={handleEditModel}>
              {/* Name Input */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Model Name"
                  className="input input-bordered w-full"
                  value={editingModel.name}
                  onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                  required
                />
              </div>

              {/* Image URL Input */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Image URL</span>
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="input input-bordered w-full"
                  value={editingModel.imageUrl}
                  onChange={(e) => setEditingModel({ ...editingModel, imageUrl: e.target.value })}
                  required
                />
              </div>

              {/* Tags Input */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Tags (comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., sci-fi, helmet, concept"
                  className="input input-bordered w-full"
                  value={editingModel.tags}
                  onChange={(e) => setEditingModel({ ...editingModel, tags: e.target.value })}
                />
              </div>

              {/* "Is New" Checkbox */}
              <div className="form-control mb-4">
                <label className="label cursor-pointer">
                  <span className="label-text">Mark as New</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={editingModel.isNew}
                    onChange={(e) => setEditingModel({ ...editingModel, isNew: e.target.checked })}
                  />
                </label>
              </div>

              {formError && (
                <p className="text-red-500 text-sm mb-4">{formError}</p>
              )}

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <form method="dialog" onSubmit={() => setEditingModel(null)}>
                  <button className="btn">Cancel</button>
                </form>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {/* Confirmation Delete Modal */}
      <dialog id="confirm_delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this model?</p>
          <div className="modal-action">
            <button
              className="btn btn-error"
              onClick={handleDeleteModel}
            >
              Confirm
            </button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminDashboard;
