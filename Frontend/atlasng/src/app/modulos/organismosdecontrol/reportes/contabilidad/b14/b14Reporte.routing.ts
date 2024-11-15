import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { B14ReporteComponent } from './componentes/b14Reporte.component';

const routes: Routes = [
  { path: '', component: B14ReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B14ReporteRoutingModule {}
