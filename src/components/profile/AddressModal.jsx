import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const AddressModal = ({ isOpen, onClose, userAddresses, onSave }) => {
  const [addresses, setAddresses] = useState([]);
  const { showError } = useToast();
  
  useEffect(() => {
    const modalAddresses = userAddresses.map(addr => ({
        id: addr._id, 
        ...addr
    }));
    setAddresses(modalAddresses);
  }, [userAddresses, isOpen]);

  const handleFieldChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };
  
  const handleAddNew = () => {
    setAddresses([
      ...addresses,
      { id: `new_${Date.now()}`, street: '', city: '', state: '', zip: '', default: false }
    ]);
  };
  
  const handleRemove = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };
  
  const handleSetDefault = (id) => {
     setAddresses(addresses.map(addr => ({ ...addr, default: addr.id === id })));
  };
  
  const handleSaveClick = () => {
    for (const addr of addresses) {
      if (!addr.street || !addr.city || !addr.state || !addr.zip) {
        showError('Please fill out all fields for all addresses.');
        return;
      }
    }
    onSave(addresses);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Addresses">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
        {addresses.map((addr, index) => (
          <div key={addr.id} className="p-4 border rounded-lg space-y-2 relative">
            <Button 
              variant="ghost" 
              className="absolute top-2 right-2 !p-1 text-red-500 hover:bg-red-100"
              onClick={() => handleRemove(addr.id)}
            >
              <Trash2 size={18} />
            </Button>
            <Input
              label="Street"
              id={`street-${index}`}
              value={addr.street}
              onChange={e => handleFieldChange(index, 'street', e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                label="City"
                id={`city-${index}`}
                value={addr.city}
                onChange={e => handleFieldChange(index, 'city', e.target.value)}
              />
              <Input
                label="State"
                id={`state-${index}`}
                value={addr.state}
                onChange={e => handleFieldChange(index, 'state', e.target.value)}
              />
              <Input
                label="Zip Code"
                id={`zip-${index}`}
                value={addr.zip}
                onChange={e => handleFieldChange(index, 'zip', e.target.value)}
              />
            </div>
            <label className="flex items-center space-x-2 pt-2">
              <input 
                type="radio" 
                name="defaultAddress" 
                checked={addr.default}
                onChange={() => handleSetDefault(addr.id)}
                className="form-radio h-4 w-4 text-amber-800"
              />
              <span className="text-sm text-gray-700">Set as default</span>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <Button onClick={handleAddNew} variant="secondary">
          <Plus size={16} className="inline mr-1" /> Add New Address
        </Button>
        <Button onClick={handleSaveClick} variant="primary">
          Save Addresses
        </Button>
      </div>
    </Modal>
  );
};

export default AddressModal;