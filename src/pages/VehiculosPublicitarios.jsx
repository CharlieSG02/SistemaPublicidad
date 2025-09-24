import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { vehiculosPublicitariosAPI } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const VehiculosPublicitarios = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: '',
    contenido: '',
    horario: '',
    hora_inicio: '',
    hora_fin: ''
  });
  const { session } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await vehiculosPublicitariosAPI.getAll();
      setData(result);
    } catch (error) {
      console.error('Error al cargar vehículos publicitarios:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Código',
      accessor: 'cod_vehiculo'
    },
    {
      header: 'Descripción',
      accessor: 'descripcion'
    },
    {
      header: 'Contenido',
      accessor: 'contenido'
    },
    {
      header: 'Horario',
      accessor: 'horario'
    },
    {
      header: 'Hora Inicio',
      accessor: 'hora_inicio'
    },
    {
      header: 'Hora Fin',
      accessor: 'hora_fin'
    }
  ];

  const searchFields = ['descripcion', 'contenido', 'horario'];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      descripcion: '',
      contenido: '',
      horario: '',
      hora_inicio: '',
      hora_fin: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      descripcion: item.descripcion,
      contenido: item.contenido,
      horario: item.horario,
      hora_inicio: item.hora_inicio,
      hora_fin: item.hora_fin
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Está seguro de que desea eliminar este elemento?')) {
      try {
        await vehiculosPublicitariosAPI.delete(item.cod_vehiculo);
        await loadData();
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
        await vehiculosPublicitariosAPI.update(editingItem.cod_vehiculo, formData);
        alert('Elemento actualizado exitosamente');
      } else {
        await vehiculosPublicitariosAPI.create(formData);
        alert('Elemento creado exitosamente');
      }
      
      setIsModalOpen(false);
      await loadData();
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
        title="Vehículos Publicitarios"
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
        title={editingItem ? 'Editar Vehículo Publicitario' : 'Agregar Vehículo Publicitario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              disabled={submitting}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido
              </label>
              <select
                name="contenido"
                value={formData.contenido}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Video">Video</option>
                <option value="Audio">Audio</option>
                <option value="Imagen">Imagen</option>
                <option value="Texto">Texto</option>
                <option value="Mixto">Mixto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horario
              </label>
              <select
                name="horario"
                value={formData.horario}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
                <option value="Todo el día">Todo el día</option>
                <option value="Prime time">Prime time</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora Inicio
              </label>
              <input
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora Fin
              </label>
              <input
                type="time"
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
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

export default VehiculosPublicitarios;
