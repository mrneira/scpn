import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuxiliarPresupuestarioIngresosComponent } from './componentes/auxiliarPresupuestarioIngresos.component';

const routes: Routes = [
  { path: '', component:AuxiliarPresupuestarioIngresosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuxiliarPresupuestarioIngresosRoutingModule {}
