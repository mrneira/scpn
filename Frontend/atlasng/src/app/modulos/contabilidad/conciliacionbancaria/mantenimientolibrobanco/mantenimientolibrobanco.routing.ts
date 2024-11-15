import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MantenimientolibrobancoComponent } from './componentes/mantenimientolibrobanco.component';

const routes: Routes = [
  { path: '', component: MantenimientolibrobancoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientolibrobancoRoutingModule {}
