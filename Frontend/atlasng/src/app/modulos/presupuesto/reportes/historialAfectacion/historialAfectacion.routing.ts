import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistorialAfectacionComponent } from './componentes/historialAfectacion.component';

const routes: Routes = [
  { path: '', component: HistorialAfectacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialAfectacionRoutingModule {}
