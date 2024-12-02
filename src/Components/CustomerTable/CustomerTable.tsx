import React, { useEffect, useState } from 'react';
import { useApiCall } from '@/utils/useApiCall';

interface Customer {
  id: number;
  name: string;
  email: string;
  contact: string;
}

const CustomerTable: React.FC<{ onViewCustomer: (customer: Customer) => void }> = ({ onViewCustomer }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const { apiCall } = useApiCall();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null); 
      try {
        const response = await apiCall({
          endpoint: "/v1/customers", 
          method: "get", 
          params: {}, 
          data: {}, 
          headers: {}, 
          successMessage: "Customers fetched successfully!", 
        });

        if (response && response.data) {
          setCustomers(response.data); 
        }
      } catch (error: any) {
        setError("Error fetching customers: " + error.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [apiCall]); 

  return (
    <div>
      {loading && <p>Loading customers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Contact</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b">
              <td className="py-2 px-4">{customer.name}</td>
              <td className="py-2 px-4">{customer.email}</td>
              <td className="py-2 px-4">{customer.contact}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => onViewCustomer(customer)}
                  className="bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
