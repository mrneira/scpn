import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CronologiaValoresReporteComponent } from './componentes/cronologiaValoresReporte.component';

const routes: Routes = [
  { path: '', component: CronologiaValoresReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CronologiaValoresReporteRoutingModule {}
