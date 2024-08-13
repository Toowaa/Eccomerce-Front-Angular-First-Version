import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Categoria } from '../Models/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http=inject(HttpClient);
  
  listarcategorias(){
    return this.http.get<Categoria[]>('http://127.0.0.1:8080/categoria');
  }

  save(categoria: Categoria){
    return this.http.post<Categoria>('http://127.0.0.1:8080/categoria',categoria)
  }

  get(id:number){
    return this.http.get<Categoria>(`http://127.0.0.1:8080/categoria/${id}`)
  }

  update(categoria:Categoria,id:number){
    return this.http.put<Categoria>(`http://127.0.0.1:8080/categoria/${id}`,categoria)
  }

  eliminar(id:number){
    return this.http.delete<Categoria>((`http://127.0.0.1:8080/categoria/${id}`));
  }
}
