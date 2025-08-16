import React, { useState, useEffect } from 'react';
import { X, Building2, Mail, Phone, MapPin, Star, Award, CreditCard } from 'lucide-react';

interface Supplier {
  id?: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  rating: number;
  totalOrders: number;
  totalValue: number;
  avgDeliveryDays: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  paymentTerms: string;
  certifications: string[];
  lastOrderDate: string;
  taxId?: string;
  website?: string;
  notes?: string;
}

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplierData: Supplier) => void;
  supplier?: Supplier | null;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  isOpen,
  onClose,
  onSave,
  supplier
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    categories: [] as string[],
    rating: 5,
    totalOrders: 0,
    totalValue: 0,
    avgDeliveryDays: 3,
    status: 'ACTIVE' as const,
    paymentTerms: 'Net 30',
    certifications: [] as string[],
    lastOrderDate: '',
    taxId: '',
    website: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'MEDIA', label: 'Culture Media' },
    { value: 'HORMONE', label: 'Hormones' },
    { value: 'REAGENT', label: 'Lab Reagents' },
    { value: 'CONSUMABLE', label: 'Consumables' },
    { value: 'EQUIPMENT', label: 'Equipment' },
    { value: 'CRYO_MATERIAL', label: 'Cryo Materials' },
    { value: 'DRUG', label: 'Pharmaceuticals' },
    { value: 'DISPOSABLE', label: 'Disposables' },
    { value: 'MAINTENANCE', label: 'Maintenance Supplies' }
  ];

  const certificationOptions = [
    'ISO 9001',
    'ISO 13485',
    'FDA Registered',
    'GMP',
    'USDA Approved',
    'DOT Certified',
    'CE Marking',
    'HACCP',
    'REACH Compliant',
    'RoHS Compliant'
  ];

  const paymentTermOptions = [
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'Due on Receipt',
    '2/10 Net 30',
    'Cash on Delivery',
    'Prepaid',
    'Credit Card',
    'Letter of Credit'
  ];

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        categories: supplier.categories,
        rating: supplier.rating,
        totalOrders: supplier.totalOrders,
        totalValue: supplier.totalValue,
        avgDeliveryDays: supplier.avgDeliveryDays,
        status: supplier.status,
        paymentTerms: supplier.paymentTerms,
        certifications: supplier.certifications,
        lastOrderDate: supplier.lastOrderDate,
        taxId: supplier.taxId || '',
        website: supplier.website || '',
        notes: supplier.notes || ''
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        categories: [],
        rating: 5,
        totalOrders: 0,
        totalValue: 0,
        avgDeliveryDays: 3,
        status: 'ACTIVE',
        paymentTerms: 'Net 30',
        certifications: [],
        lastOrderDate: '',
        taxId: '',
        website: '',
        notes: ''
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (formData.categories.length === 0) newErrors.categories = 'At least one category is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    
    handleInputChange('categories', updatedCategories);
  };

  const handleCertificationToggle = (certification: string) => {
    const updatedCertifications = formData.certifications.includes(certification)
      ? formData.certifications.filter(c => c !== certification)
      : [...formData.certifications, certification];
    
    handleInputChange('certifications', updatedCertifications);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Company Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Life Technologies Corp"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID / VAT Number
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="123-45-6789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://www.company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="123 Business Street, City, State, ZIP"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Contact Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      errors.contactPerson ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Dr. John Smith"
                  />
                  {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="contact@company.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+1-555-123-4567"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Product Categories *
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(category => (
                  <label key={category.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.value)}
                      onChange={() => handleCategoryToggle(category.value)}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{category.label}</span>
                  </label>
                ))}
              </div>
              {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories}</p>}
            </div>

            {/* Business Terms */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Business Terms
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {paymentTermOptions.map(term => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                      className={`w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                        errors.rating ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-500">out of 5</span>
                  </div>
                  {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Delivery Time (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.avgDeliveryDays}
                  onChange={(e) => handleInputChange('avgDeliveryDays', parseInt(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Certifications & Compliance
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {certificationOptions.map(certification => (
                  <label key={certification} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(certification)}
                      onChange={() => handleCertificationToggle(certification)}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{certification}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Additional Notes
              </h4>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Additional information about this supplier..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {supplier ? 'Update Supplier' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 