import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { publicoObjetivoAPI } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const PublicoObjetivo = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sexo: '',
    nivel_socioeconomico: '',
    nivel_educativo: '',
    rango_edad: '',
    interes: '',
    estado_civil: ''
  });
  const { session } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await publicoObjetivoAPI.getAll();
      setData(result);
    } catch (error) {
      console.error('Error al cargar público objetivo:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Código',
      accessor: 'cod_publico_objetivo'
    },
    {
      header: 'Sexo',
      accessor: 'sexo'
    },
    {
      header: 'Nivel Socioeconómico',
      accessor: 'nivel_socioeconomico'
    },
    {
      header: 'Nivel Educativo',
      accessor: 'nivel_educativo'
    },
    {
      header: 'Rango de Edad',
      accessor: 'rango_edad'
    },
    {
      header: 'Interés',
      accessor: 'interes'
    },
    {
      header: 'Estado Civil',
      accessor: 'estado_civil'
    }
  ];

  const searchFields = ['sexo', 'nivel_socioeconomico', 'nivel_educativo', 'rango_edad', 'interes', 'estado_civil'];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      sexo: '',
      nivel_socioeconomico: '',
      nivel_educativo: '',
      rango_edad: '',
      interes: '',
      estado_civil: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      sexo: item.sexo,
      nivel_socioeconomico: item.nivel_socioeconomico,
      nivel_educativo: item.nivel_educativo,
      rango_edad: item.rango_edad,
      interes: item.interes,
      estado_civil: item.estado_civil
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Está seguro de que desea eliminar este elemento?')) {
      try {
        await publicoObjetivoAPI.delete(item.cod_publico_objetivo);
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
        await publicoObjetivoAPI.update(editingItem.cod_publico_objetivo, formData);
        alert('Elemento actualizado exitosamente');
      } else {
        await publicoObjetivoAPI.create(formData);
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
        title="Público Objetivo"
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
        title={editingItem ? 'Editar Público Objetivo' : 'Agregar Público Objetivo'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
              </label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel Socioeconómico
              </label>
              <select
                name="nivel_socioeconomico"
                value={formData.nivel_socioeconomico}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Alto">Alto</option>
                <option value="Medio-Alto">Medio-Alto</option>
                <option value="Medio">Medio</option>
                <option value="Medio-Bajo">Medio-Bajo</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel Educativo
              </label>
              <select
                name="nivel_educativo"
                value={formData.nivel_educativo}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Primaria">Primaria</option>
                <option value="Secundaria">Secundaria</option>
                <option value="Técnico">Técnico</option>
                <option value="Universitario">Universitario</option>
                <option value="Postgrado">Postgrado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rango de Edad
              </label>
              <select
                name="rango_edad"
                value={formData.rango_edad}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-55">46-55</option>
                <option value="56-65">56-65</option>
                <option value="65+">65+</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interés
              </label>
              <input
                type="text"
                name="interes"
                value={formData.interes}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Civil
              </label>
              <select
                name="estado_civil"
                value={formData.estado_civil}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccionar</option>
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Viudo">Viudo</option>
                <option value="Unión libre">Unión libre</option>
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

export default PublicoObjetivo;
