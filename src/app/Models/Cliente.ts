export interface Cliente {
    dni: number;
    usuario: string;
    contraseña: string;
    nombre: string;
    apellido: string;
    telefono: number;
    direccion: {
      id: number;
      calle: string;
      numero_exterior: string;
      ciudad: string;
      codigopostal: string;
      tipodireccion: string;
    };
  }
  