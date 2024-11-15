import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CedulaPresupuestariaGastosComponent } from './componentes/cedulaPresupuestariaGastos.component';

const routes: Routes = [
  { path: '', component: CedulaPresupuestariaGastosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CedulaPresupuestariaGastosRoutingModule {}
