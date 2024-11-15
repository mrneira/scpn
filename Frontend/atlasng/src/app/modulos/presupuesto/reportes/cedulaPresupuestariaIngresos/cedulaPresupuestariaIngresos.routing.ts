import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CedulaPresupuestariaIngresosComponent } from './componentes/cedulaPresupuestariaIngresos.component';

const routes: Routes = [
  { path: '', component: CedulaPresupuestariaIngresosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CedulaPresupuestariaIngresosRoutingModule {}
