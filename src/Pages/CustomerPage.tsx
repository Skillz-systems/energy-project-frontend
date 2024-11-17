import React, { useState } from 'react';

import Header from '@/Components/Header/Header';
import CustomerTable from '@/Components/CustomerTable/CustomerTable';
import CustomerModal from '@/Components/CustomerModal/CustomerModal';
import ViewCustomerModal from '@/Components/ViewCustomerModal/ViewCustomerModal';

interface Customer {
  id: number;
  name: string;
  email: string;
  contact: string;
  
}

const CustomerPage: React.FC = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  const openViewModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  const closeViewModal = () => setViewModalOpen(false);

  return (
    <div className="container mx-auto p-4">
      <Header title="Customers" />
      <div className="flex justify-between items-center my-4">
        <h2 className="text-xl font-bold">Customer List</h2>
        <button
          onClick={openCreateModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Customer
        </button>
      </div>

      <CustomerTable onViewCustomer={openViewModal} />

      <CustomerModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />

      {selectedCustomer && (
        <ViewCustomerModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
};

export default CustomerPage;
