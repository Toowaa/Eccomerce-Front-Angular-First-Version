interface Direccion {
    id?: number;
    calle: string;
    numero_exterior: string;
    ciudad: string;
    codigopostal: string;
    tipodireccion: string;
    [key: string]: any; // Para cualquier otra propiedad que pueda existir
  }