export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  categoriaModel: {
    id: number;
  };
}