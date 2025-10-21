import React, { useState } from 'react';
import type { Award } from '../../../types/dataModels';

interface AwardFormProps {
  award: Award | null;
  onSave: (awardData: Partial<Award>) => Promise<void>;
  onCancel: () => void;
}

export const AwardForm: React.FC<AwardFormProps> = ({ award, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: award?.name || '',
    description: award?.description || '',
    category: award?.category || ('Excellence' as Award['category']),
    eligibility: award?.eligibility || '',
    deadline: award?.deadline ? award.deadline.toISOString().split('T')[0] : '',
    isActive: award?.isActive ?? true,
    maxNominations: award?.maxNominations?.toString() || '',
    selectionCriteria: award?.selectionCriteria?.join('\n') || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        name: formData.name,
        description: formData.description,
        category: formData.category as Award['category'],
        eligibility: formData.eligibility,
        deadline: new Date(formData.deadline),
        isActive: formData.isActive,
        maxNominations: formData.maxNominations ? parseInt(formData.maxNominations) : undefined,
        selectionCriteria: formData.selectionCriteria ? formData.selectionCriteria.split('\n').filter(s => s.trim()) : [],
      });
    } catch (error) {
      console.error('Error saving award:', error);
      alert('Error saving award');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Award Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Award['category'] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Excellence">Excellence</option>
            <option value="Lifetime">Lifetime</option>
            <option value="Innovation">Innovation</option>
            <option value="Service">Service</option>
            <option value="Rising Star">Rising Star</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Eligibility Requirements *
        </label>
        <textarea
          required
          value={formData.eligibility}
          onChange={(e) => setFormData(prev => ({ ...prev, eligibility: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deadline *
          </label>
          <input
            type="date"
            required
            value={formData.deadline}
            onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Nominations (optional)
          </label>
          <input
            type="number"
            value={formData.maxNominations}
            onChange={(e) => setFormData(prev => ({ ...prev, maxNominations: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selection Criteria (one per line)
        </label>
        <textarea
          value={formData.selectionCriteria}
          onChange={(e) => setFormData(prev => ({ ...prev, selectionCriteria: e.target.value }))}
          rows={4}
          placeholder="Excellence in teaching&#10;Innovation in curriculum&#10;Student impact"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active (accepting nominations)
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (award ? 'Update Award' : 'Create Award')}
        </button>
      </div>
    </form>
  );
};