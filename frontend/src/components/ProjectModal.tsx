import React, { useState, useEffect } from 'react';


export interface Project {
  id?: number; 
  proyecto: string;
  estado: 'Planificado' | 'En Progreso' | 'Completado'; 
  fechaInicio: string;
  fechaFin: string;
  responsable: string;
}


interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Project) => void;
  initialData: Project | null;
}

export default function ProjectModal({ isOpen, onClose, onSubmit, initialData }: ProjectModalProps) {
  const [formData, setFormData] = useState<Project>({
    proyecto: '',
    estado: 'Planificado',
    fechaInicio: '',
    fechaFin: '',
    responsable: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        proyecto: '',
        estado: 'Planificado',
        fechaInicio: '',
        fechaFin: '',
        responsable: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
  };
  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white', padding: '20px', borderRadius: '8px', 
    width: '400px', maxWidth: '90%'
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>{initialData ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Proyecto:</label>
            <input type="text" name="proyecto" value={formData.proyecto} onChange={handleChange} required style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Estado:</label>
            <select name="estado" value={formData.estado} onChange={handleChange} style={{ width: '100%' }}>
              <option value="Planificado">Planificado</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Fecha Inicio:</label>
            <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required style={{ width: '100%' }}/>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Fecha Fin:</label>
            <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required style={{ width: '100%' }}/>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Responsable:</label>
            <input type="text" name="responsable" value={formData.responsable} onChange={handleChange} required style={{ width: '100%' }}/>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ padding: '5px 10px' }}>Cancelar</button>
            <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px' }}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}