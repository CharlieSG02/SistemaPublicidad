import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { tipoProductoAPI } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const TipoProducto = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rubro: '',
    familia: '',
    clase: ''
  });
  const { session } = useAuth();

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await tipoProductoAPI.getAll();
      setData(result);
    } catch (error) {
      console.error('Error al cargar tipos de producto:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Código',
      accessor: 'cod_tipo_producto'
    },
    {
      header: 'Rubro',
      accessor: 'rubro'
    },
    {
      header: 'Familia',
      accessor: 'familia'
    },
    {
      header: 'Clase',
      accessor: 'clase'
    }
  ];

  const searchFields = ['rubro', 'familia', 'clase'];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ rubro: '', familia: '', clase: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      rubro: item.rubro,
      familia: item.familia,
      clase: item.clase
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Está seguro de que desea eliminar este elemento?')) {
      try {
        await tipoProductoAPI.delete(item.cod_tipo_producto);
        await loadData(); // Recargar datos
        alert('Elemento eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el elemento');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingItem) {
        await tipoProductoAPI.update(editingItem.cod_tipo_producto, formData);
        alert('Elemento actualizado exitosamente');
      } else {
        await tipoProductoAPI.create(formData);
        alert('Elemento creado exitosamente');
      }
      
      setIsModalOpen(false);
      await loadData(); // Recargar datos
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el elemento');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <DataTable
        title="Tipo de Producto"
        data={data}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchFields={searchFields}
        isAuthenticated={!!session}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Tipo de Producto' : 'Agregar Tipo de Producto'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rubro
            </label>
            <input
              type="text"
              name="rubro"
              value={formData.rubro}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Familia
            </label>
            <input
              type="text"
              name="familia"
              value={formData.familia}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clase
            </label>
            <input
              type="text"
              name="clase"
              value={formData.clase}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Agregar')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TipoProducto;
