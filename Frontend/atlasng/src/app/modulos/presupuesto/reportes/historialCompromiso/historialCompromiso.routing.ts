import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistorialCompromisoComponent } from './componentes/historialCompromiso.component';

const routes: Routes = [
  { path: '', component: HistorialCompromisoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialCompromisoRoutingModule {}
