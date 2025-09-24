import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { espaciosPublicitariosAPI, vehiculosPublicitariosAPI } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const EspaciosPublicitarios = () => {
  const [data, setData] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cod_vehiculo: '',
    descripcion: '',
    medio: '',
    audiencia_promedio: '',
    unidad_alquiler: '',
    precio_x_unidad: '',
    alcance_geografico: '',
    categoria: '',
    dia: ''
  });
  const { session } = useAuth();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [espaciosResult, vehiculosResult] = await Promise.all([
        espaciosPublicitariosAPI.getAll(),
        vehiculosPublicitariosAPI.getAll()
      ]);
      setData(espaciosResult);
      setVehiculos(vehiculosResult);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const result = await espaciosPublicitariosAPI.getAll();
      setData(result);
    } catch (error) {
      console.error('Error al recargar espacios publicitarios:', error);
    }
  };

  const columns = [
    {
      header: 'Código',
      accessor: 'cod_espacio'
    },
    {
      header: 'Vehículo',
      accessor: 'vehiculos_publicitarios.descripcion',
      render: (item) => item.vehiculos_publicitarios?.descripcion || 'N/A'
    },
    {
      header: 'Descripción',
      accessor: 'descripcion'
    },
    {
      header: 'Medio',
      accessor: 'medio'
    },
    {
      header: 'Audiencia',
      accessor: 'audiencia_promedio',
      render: (item) => item.audiencia_promedio.toLocaleString()
    },
    {
      header: 'Precio',
      accessor: 'precio_x_unidad',
      render: (item) => `$${parseFloat(item.precio_x_unidad).toLocaleString()}`
    },
    {
      header: 'Categoría',
      accessor: 'categoria'
    }
  ];

  const searchFields = ['descripcion', 'medio', 'alcance_geografico', 'categoria', 'dia', 'vehiculos_publicitarios.descripcion'];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      cod_vehiculo: '',
      descripcion: '',
      medio: '',
      audiencia_promedio: '',
      unidad_alquiler: '',
      precio_x_unidad: '',
      alcance_geografico: '',
      categoria: '',
      dia: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      cod_vehiculo: item.cod_vehiculo.toString(),
      descripcion: item.descripcion,
      medio: item.medio,
      audiencia_promedio: item.audiencia_promedio.toString(),
      unidad_alquiler: item.unidad_alquiler,
      precio_x_unidad: item.precio_x_unidad.toString(),
      alcance_geografico: item.alcance_geografico,
      categoria: item.categoria,
      dia: item.dia
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Está seguro de que desea eliminar este elemento?')) {
      try {
        await espaciosPublicitariosAPI.delete(item.cod_espacio);
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
      const processedData = {
        ...formData,
        cod_vehiculo: parseInt(formData.cod_vehiculo),
        audiencia_promedio: parseInt(formData.audiencia_promedio),
        precio_x_unidad: parseFloat(formData.precio_x_unidad)
      };

      if (editingItem) {
        await espaciosPublicitariosAPI.update(editingItem.cod_espacio, processedData);
        alert('Elemento actualizado exitosamente');
      } else {
        await espaciosPublicitariosAPI.create(processedData);
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
        title="Espacios Publicitarios"
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
        title={editingItem ? 'Editar Espacio Publicitario' : 'Agregar Espacio Publicitario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehículo Publicitario
              </label>
              <select
                name="cod_vehiculo"
                value={formData.cod_vehiculo}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar vehículo</option>
                {vehiculos.map(v => (
                  <option key={v.cod_vehiculo} value={v.cod_vehiculo}>
                    {v.descripcion}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medio
              </label>
              <select
                name="medio"
                value={formData.medio}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Televisión">Televisión</option>
                <option value="Radio">Radio</option>
                <option value="Digital">Digital</option>
                <option value="Impreso">Impreso</option>
                <option value="Exterior">Exterior</option>
                <option value="Cine">Cine</option>
              </select>
            </div>
          </div>

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
                Audiencia Promedio
              </label>
              <input
                type="number"
                name="audiencia_promedio"
                value={formData.audiencia_promedio}
                onChange={handleInputChange}
                required
                min="0"
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad de Alquiler
              </label>
              <select
                name="unidad_alquiler"
                value={formData.unidad_alquiler}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Segundo">Segundo</option>
                <option value="Minuto">Minuto</option>
                <option value="Hora">Hora</option>
                <option value="Día">Día</option>
                <option value="Semana">Semana</option>
                <option value="Mes">Mes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio por Unidad
              </label>
              <input
                type="number"
                name="precio_x_unidad"
                value={formData.precio_x_unidad}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alcance Geográfico
              </label>
              <select
                name="alcance_geografico"
                value={formData.alcance_geografico}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Local">Local</option>
                <option value="Regional">Regional</option>
                <option value="Nacional">Nacional</option>
                <option value="Internacional">Internacional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Premium">Premium</option>
                <option value="Estándar">Estándar</option>
                <option value="Básico">Básico</option>
                <option value="Promocional">Promocional</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Día
              </label>
              <select
                name="dia"
                value={formData.dia}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
                <option value="Todos">Todos</option>
              </select>
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

export default EspaciosPublicitarios;
