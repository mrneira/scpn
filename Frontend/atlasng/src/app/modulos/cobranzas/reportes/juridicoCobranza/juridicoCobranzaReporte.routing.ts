import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuridicoCobranzaReporteComponent } from './componentes/juridicoCobranzaReporte.component';

const routes: Routes = [
  { path: '', component: JuridicoCobranzaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuridicoCobranzaReporteRoutingModule {}
