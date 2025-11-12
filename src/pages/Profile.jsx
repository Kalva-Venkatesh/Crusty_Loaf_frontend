import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';

const ProfilePage = ({ setPage }) => {
  const { user, updateAddresses } = useAuth();
  const { showToast, showError } = useToast();
  const [addresses, setAddresses] = useState(user.addresses.map(a => ({...a, id: a._id })));
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = async () => {
    try {
      await updateAddresses(addresses);
      setIsEditing(false);
      showToast("Addresses saved successfully!");
    } catch (err) {
      showError(err.message);
    }
  };
  
  const handleCancel = () => {
    setAddresses(user.addresses.map(a => ({...a, id: a._id }))); // Reset
    setIsEditing(false);
    toast('Changes discarded', { icon: 'ℹ️' });
  };
  
  // Handlers for address form
  const handleFieldChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);
  };
  const handleAddNew = () => {
    setAddresses([
      ...addresses,
      { id: `new_${Date.now()}`, street: '', city: '', state: '', zip: '', default: addresses.length === 0 }
    ]);
  };
  const handleRemove = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };
  const handleSetDefault = (id) => {
     setAddresses(addresses.map(addr => ({ ...addr, default: addr.id === id })));
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.isAdmin ? 'Admin' : 'Customer'}</p>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Addresses</h2>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="secondary">Edit</Button>
          )}
        </div>
        
        <div className="space-y-4">
          {addresses.map((addr, index) => (
            <div key={addr.id} className="p-4 border rounded-lg">
              {!isEditing ? (
                <div>
                  <p className="font-semibold">{addr.street} {addr.default && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">Default</span>}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                </div>
              ) : (
                <div className="space-y-2 relative">
                  <Button 
                    variant="ghost" 
                    className="absolute top-0 right-0 !p-1 text-red-500 hover:bg-red-100"
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
                    <Input label="City" id={`city-${index}`} value={addr.city} onChange={e => handleFieldChange(index, 'city', e.target.value)} />
                    <Input label="State" id={`state-${index}`} value={addr.state} onChange={e => handleFieldChange(index, 'state', e.target.value)} />
                    <Input label="Zip" id={`zip-${index}`} value={addr.zip} onChange={e => handleFieldChange(index, 'zip', e.target.value)} />
                  </div>
                  <label className="flex items-center space-x-2 pt-2">
                    <input type="radio" name="defaultAddress" checked={addr.default} onChange={() => handleSetDefault(addr.id)} className="form-radio h-4 w-4 text-amber-800" />
                    <span className="text-sm text-gray-700">Set as default</span>
                  </label>
                </div>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div>
              <Button onClick={handleAddNew} variant="secondary" className="mt-2">
                <Plus size={16} className="inline mr-1" /> Add New Address
              </Button>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleCancel} variant="ghost">Cancel</Button>
                <Button onClick={handleSave} variant="primary">Save Changes</Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;