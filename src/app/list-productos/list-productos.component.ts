import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ProductoService } from '../Services/producto.service';
import { MatCardModule } from '@angular/material/card';
import { NgFor } from '@angular/common';
import { Producto } from '../Models/Producto';

@Component({
  selector: 'app-list-productos',
  standalone: true,
  imports: [NgFor,MatCardModule ,RouterOutlet,RouterModule, MatIconModule,RouterLink],
  templateUrl: './list-productos.component.html',
  styleUrl: './list-productos.component.css'
})
export class ListProductosComponent implements OnInit {
  private productoService= inject(ProductoService);
  producto:any [] = [];

 
    ngOnInit(): void {
       this.loadAll(); 
  
    }

    loadAll(){
      this.productoService.listar().
      subscribe((producto:any )=>{
      this.producto=producto
       console.log(this.producto=producto)
      });
    }

    borrar(productoid: number) {
      this.productoService.eliminar(productoid)
        .subscribe(
          () => {
            console.log("Producto eliminado");
            // Actualizar la lista de productos después de eliminar
            this.loadAll();
          },
          (error) => {
            console.error("Error al eliminar el producto:", error);
          }
        );
    }

}
