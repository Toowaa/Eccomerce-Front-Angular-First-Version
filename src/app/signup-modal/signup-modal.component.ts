import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProductoService } from '../Services/producto.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RegistroService } from '../Services/registro.service';
import { UsuarioService } from '../Services/usuario.service';
import {MatSidenavModule} from '@angular/material/sidenav';

import {MatMenuModule} from '@angular/material/menu';

import {MatGridListModule} from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [MatSidenavModule,CommonModule, MatCardModule,MatGridListModule,MatSidenavModule,MatIcon,MatButton,MatButtonModule,MatMenuModule,RouterLink],
  templateUrl: './signup-modal.component.html',
  styleUrl: './signup-modal.component.css'
})
export class SignupModalComponent {
  private productoService= inject(ProductoService);
  private registroService=inject(RegistroService);
  private usuarioService=inject(UsuarioService);
  producto:any [] = [];
  data:any []=[];
  isLoggedIn: boolean = false;
  productoDetails: any = [];


  userId: number | null = null;
  username: string | null = null;
  constructor(private authService: AuthService) {}

  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);


    ngOnInit(): void {
       this.loadAll(); 


    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.userId = this.authService.getUserId();
        this.username = this.authService.getUsername();
        console.log('ID del usuario:', this.userId);
        console.log('Nombre de usuario:', this.username);
      } else {
        console.log('No hay usuario logueado');
      }
    });
    this.carrit();
   this.tes();
    }

    loadAll(){
      this.productoService.listar().
      subscribe((producto:any )=>{
      this.producto=producto
      console.log(this.producto=producto)
      });
    }
  
    carrit() {
      console.log('Método carrit() llamado');
      if (this.userId !== null) {
        this.usuarioService.carritocompras(this.userId).subscribe(
          (data: any) => {
           // console.log('Respuesta completa del carrito:', data);
            if (Array.isArray(data) && data.length > 0) {
              this.data = data;
            //  console.log('Carrito de compras actualizado:', this.data);
              this.data.forEach((item: any) => {
              //  console.log(`Obteniendo detalles para el producto ${item.idProducto}`);
                this.getProductDetails(item.idProducto);
              });
            } else {
              console.log('El carrito está vacío o la respuesta no es un array');
            }
          },
          (error) => {
            console.error('Error al obtener el carrito de compras:', error);
          }
        );
      } else {
        console.log('No se puede obtener el carrito de compras: Usuario no identificado');
      }
    }

   /* comprar(productoId: number) {
      if (this.userId !== null) {
        const buy = {
          idCliente: this.userId,
          idProducto: productoId,
          cantidad: 1
        };
        this.usuarioService.comprar(buy).subscribe(
          () => {
            console.log("Producto agregado al carrito");
            // Actualizar el carrito después de una compra exitosa
            this.carrit();
            // Obtener los detalles del producto
            this.getProductDetails(productoId);
          },
          error => {
           // console.log("buy:", buy);
            console.error("Error al agregar el producto al carrito", error);
            // Aún así, intentamos obtener los detalles del producto
            this.getProductDetails(productoId);
          }
        );
      } else {
        console.log("Usuario no identificado. No se puede agregar al carrito.");
      }
    }
    */
    comprar(productoId: number) {
      const stock= this.productoDetails[productoId]?.stock;

      if (this.userId !== null) {
        const existingItem = this.data.find(item => item.idProducto === productoId);
        
        if (existingItem) {
          if(stock ==existingItem.cantidad ){
            alert("No puedes Agregar más a tu carrito de este producto stock Maximo")

          }else{
          const nuevaCantidad = existingItem.cantidad + 1;
    
          this.usuarioService.actualizarCarrito(this.userId, productoId, nuevaCantidad).subscribe(
            (response) => {
              console.log("Cantidad actualizada en el carrito", response);

              console.log("Stock:", this.productoDetails[productoId]?.stock ?? 'Stock no disponible');              
              
              this.carrit(); 
              this.getProductDetails(productoId);
            },
            error => {
              console.error("Error al actualizar la cantidad en el carrito", error);
            }
          );
        }} else {
          const buy = {
            idCliente: this.userId,
            idProducto: productoId,
            cantidad: 1
          };
    
          this.usuarioService.comprar(buy).subscribe(
            () => {
              console.log("Producto agregado al carrito");
              this.carrit();
              this.getProductDetails(productoId);
            },
            error => {
              console.error("Error al agregar el producto al carrito", error);
              this.getProductDetails(productoId);
            }
          );
        }
      } else {
        console.log("Usuario no identificado. No se puede agregar al carrito.");
      }
    }

    getProductDetails(id: number) {
      this.productoService.getproductoid(id).subscribe(
        (details: any) => {
          if (details === null || details === undefined) {
            console.error(`No se recibieron datos para el producto ${id}`);
          } else {
            this.productoDetails[id] = details;
           // console.log(`Estructura completa de productoDetails[${id}]:`, JSON.stringify(this.productoDetails[id], null, 2));
          }
        },
        (error) => {
          console.error(`Error al obtener detalles del producto ${id}:`, error);
        }
      );
    }
    
    tes(){
      this.productoService.getproductoid(1).subscribe((producto:any)=>{
        //console.log("PRODUCTO TEST:",producto)
      });
    }
    getImageSrc(base64String: string): string {
      if (!base64String) {
        return '../../../../assets/imagenes/producto1.jpg'; // imagen por defecto
      }
      
      if (base64String.startsWith('data:image')) {
        return base64String; // la cadena ya incluye el prefijo
      } else {
        return `data:image/jpeg;base64,${base64String}`; // añadimos el prefijo
      }
    }
    borrar() {
      if (this.userId) {
        this.usuarioService.borrarCarrito(this.userId).subscribe({
          next: (response) => {
            console.log(response.mensaje);
            this.data = []; // Limpiar los datos del carrito localmente
            this.carrit(); // Actualizar la vista del carrito
          },
          error: (error) => {
            console.error('Error al borrar el carrito', error);
            if (error.error && error.error.error) {
              console.log(error.error.error);
              this.data = []; // Limpiar los datos del carrito localmente
              this.carrit();
            }
          }
        });
      } else {
        console.log('Usuario no identificado. No se puede borrar el carrito.');
      }
    }

    logout() {
      this.authService.logout();
      window.location.reload();
    }
}