import React from 'react';
import Modal from 'react-modal';
const ViewCustomerModal: React.FC<{ isOpen: boolean, onClose: () => void, customer: any }> = ({ isOpen, onClose, customer }) => (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="View Customer Modal">
      <h2>Customer Details</h2>
      <p><strong>Name:</strong> {customer.name}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Contact:</strong> {customer.contact}</p>
      <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded mt-4">
        Close
      </button>
    </Modal>
  );
  
  export default ViewCustomerModal;
  