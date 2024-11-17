import React from 'react';
import Modal from 'react-modal';


Modal.setAppElement('#root'); 

const CreateCustomerModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Create Customer Modal">
    <h2>Create New Customer</h2>
    <form>
      
      <input type="text" placeholder="Name" className="border p-2 mb-2 w-full" />
      <input type="email" placeholder="Email" className="border p-2 mb-2 w-full" />
      <input type="tel" placeholder="Contact" className="border p-2 mb-2 w-full" />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Save Customer
      </button>
      <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded mt-4 ml-2">
        Cancel
      </button>
    </form>
  </Modal>
);

export default CreateCustomerModal;
