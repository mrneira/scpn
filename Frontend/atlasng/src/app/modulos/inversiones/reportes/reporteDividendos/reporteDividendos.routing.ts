import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteDividendosComponent } from './componentes/reporteDividendos.components';


const routes: Routes = [
  { path: '', component: ReporteDividendosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteDividendosRoutingModule {}
