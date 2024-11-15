import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentaaccionComponent } from './componentes/ventaaccion.component';

const routes: Routes = [
  { path: '', component: VentaaccionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaaccionRoutingModule {}
