import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private http=inject(HttpClient);

  save(direccion:any){
    return this.http.post('http://127.0.0.1:8080/direcciones',direccion);
  }
  
}
