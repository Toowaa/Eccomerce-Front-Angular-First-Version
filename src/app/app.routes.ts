import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PagoComponent } from './pago/pago.component';
import { ListProductosComponent } from './list-productos/list-productos.component';
import { ProductoFrmComponent } from './producto-frm/producto-frm.component';
import { FrmCategoriaComponent } from './frm-categoria/frm-categoria.component';
import { CategoriaFrmComponent } from './categoria-frm/categoria-frm.component';
import { LoginComponent } from './login/login.component';

import { SignupModalComponent } from './signup-modal/signup-modal.component';
import { RegistraComponent } from './registra/registra.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  
        {path:"",component:LoginComponent},
        {path:"home",component:HomeComponent, canActivate: [authGuard]},
        { path: "pago", component: PagoComponent, canActivate: [authGuard] },
        { path: "lista", component: ListProductosComponent, canActivate: [authGuard] },
        { path: "new", component: ProductoFrmComponent, canActivate: [authGuard] },
        { path: "categoria", component: FrmCategoriaComponent, canActivate: [authGuard] },
        { path: "nuevacategoria", component: CategoriaFrmComponent, canActivate: [authGuard] },
        { path: 'categoria/:id', component: CategoriaFrmComponent, canActivate: [authGuard] },
        { path: 'producto/:id', component: ProductoFrmComponent, canActivate: [authGuard] },
        {path:'login',component:LoginComponent},
        {path:'registra',component:RegistraComponent},
        {path:'modal',component:SignupModalComponent, canActivate: [authGuard]},
        { path: '**', redirectTo: '/home' }


];
