import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilesReporteComponent } from './componentes/perfilesReporte.component';

const routes: Routes = [
  { path: '', component: PerfilesReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilesReporteRoutingModule {}
