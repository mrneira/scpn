import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportePagosModificadosComponent } from './componentes/reportePagosModificados.component';

const routes: Routes = [
  { path: '', component: ReportePagosModificadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportePagosModificadosRoutingModule {}
