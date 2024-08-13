import { Component, OnInit, inject } from '@angular/core';
import { CategoriaService } from '../Services/categoria.service';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Categoria } from '../Models/Categoria';

@Component({
  selector: 'app-frm-categoria',
  standalone: true,
  imports: [NgFor,MatCardModule ,RouterOutlet, MatIconModule,RouterLink],
  templateUrl: './frm-categoria.component.html',
  styleUrl: './frm-categoria.component.css'
})
export class FrmCategoriaComponent implements OnInit{
   private categoriaService=inject(CategoriaService);
  categoria:Categoria[] = [];
   ngOnInit(): void {
    this.loadAll();
   }

   loadAll(){
    this.categoriaService.listarcategorias().
    subscribe((categoria )=>{
      this.categoria=categoria
    });

   }

   delete(categoria:Categoria){
    this.categoriaService.eliminar(categoria.id).
    subscribe(()=>{
      console.log('eliminado')
      this.loadAll();
    })
   }
}
