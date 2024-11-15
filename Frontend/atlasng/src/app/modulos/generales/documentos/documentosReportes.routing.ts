import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentosReportesComponent } from './componentes/documentosReportes.component';

const routes: Routes = [
  { path: '', component: DocumentosReportesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentosReportesRoutingModule {}
