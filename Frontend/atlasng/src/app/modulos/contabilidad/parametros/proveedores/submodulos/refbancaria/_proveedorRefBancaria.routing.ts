import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProveedorRefBancariaComponent } from './componentes/_proveedorRefBancaria.component';

const routes: Routes = [
  { path: '', component: ProveedorRefBancariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRefBancariaRoutingModule {}
