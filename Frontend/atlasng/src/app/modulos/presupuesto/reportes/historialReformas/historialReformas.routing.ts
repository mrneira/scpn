import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistorialReformasComponent } from './componentes/historialReformas.component';

const routes: Routes = [
  { path: '', component: HistorialReformasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialReformasRoutingModule {}
