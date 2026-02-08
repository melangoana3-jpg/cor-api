
export interface Documento {
  id: number;
  titulo: string;
  estado: 'Borrador' | 'Revisión' | 'Publicado';
  fecha_creacion: string;
}

export enum TabNames {
  DASHBOARD = 'DASHBOARD',
  SERVER_CODE = 'SERVER_CODE',
  DOCS = 'DOCS',
  PIPELINE = 'PIPELINE'
}

export interface FileData {
  name: string;
  content: string;
  language: string;
}
