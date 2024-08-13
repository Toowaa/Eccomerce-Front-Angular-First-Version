import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Cliente } from '../Models/Cliente';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http= inject(HttpClient)
  private authServices = inject(AuthService)

  
  listar(){
    return this.http.get('http://127.0.0.1:8080/cliente')
  }

  save(usuario:any){
    return this.http.post('http://127.0.0.1:8080/cliente',usuario)
  }

  dni(dni:number): Observable<boolean> {
    return this.http.get<boolean>((`http://127.0.0.1:8080/cliente/dni/${dni}`))
  }
  
  usuario(usuario: string) {
    return this.http.get(`http://127.0.0.1:8080/cliente/user/${usuario}`);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`http://127.0.0.1:8080/cliente/login`,{username, password }).pipe(
      tap(user => {
        // Guarda el usuario en el AuthService cuando el login es exitoso
        this.authServices.login(user);
      })
    );
  }

 carritocompras(id:number){
  return this.http.get(`http://127.0.0.1:8080/buy/cliente/${id}/productos`)
 }

 comprar(buy: { idCliente: number, idProducto: number, cantidad: number }){
  return this.http.post('http://127.0.0.1:8080/buy',buy)
 }

 borrarCarrito(userId: number): Observable<any> {
  return this.http.delete(`http://127.0.0.1:8080/buy/borrar/${userId}`);
  }
  
  actualizarCarrito(idCliente: number, idProducto: number, cantidad: number) {
    const url = `http://127.0.0.1:8080/buy/carrito/${idCliente}/${idProducto}`;
    const body = { cantidad: cantidad };
    
    return this.http.put<any>(url, body);
  }


}
