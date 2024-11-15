import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProveedorDireccionComponent } from './componentes/_proveedorDireccion.component';

const routes: Routes = [
  { path: '', component: ProveedorDireccionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorDireccionRoutingModule {}
