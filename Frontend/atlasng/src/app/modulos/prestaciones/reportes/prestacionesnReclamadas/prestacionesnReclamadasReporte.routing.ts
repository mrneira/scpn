import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrestacionesnReclamadasReporteComponent } from './componentes/prestacionesnReclamadasReporte.component';

const routes: Routes = [
  { path: '', component: PrestacionesnReclamadasReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestacionesnReclamadasReporteRoutingModule {}
