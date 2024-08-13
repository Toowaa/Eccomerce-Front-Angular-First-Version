import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../Models/Producto';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ProductoService {
   private http=inject(HttpClient);
  
  listar(){
    return this.http.get('http://127.0.0.1:8080/Producto');
  }
  


  get(id:number){
    return this.http.get(`http://127.0.0.1:8080/categoria/${id}`)
  }

  getproductoid(id:number){
    return this.http.get(`http://127.0.0.1:8080/Producto/${id}`)
  }

  save(producto:any){
    return this.http.post('http://127.0.0.1:8080/Producto',producto);
  }

  update(producto:any,id:number){
    return this.http.put(`http://127.0.0.1:8080/categoria/${id}`,producto)
  }

  eliminar(id:number){
    return this.http.delete((`http://127.0.0.1:8080/categoria/${id}`));
  }

  actualizarstock(idProducto: number ,datos: { stock: number }) {
    return this.http.put(`http://127.0.0.1:8080/Producto/stock/${idProducto}`,datos);
  }
}