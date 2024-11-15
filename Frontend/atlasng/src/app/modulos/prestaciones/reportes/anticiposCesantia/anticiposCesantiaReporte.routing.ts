import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnticiposCesantiaReporteComponent } from './componentes/anticiposCesantiaReporte.component';

const routes: Routes = [
  { path: '', component: AnticiposCesantiaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnticiposCesantiaReporteRoutingModule {}
