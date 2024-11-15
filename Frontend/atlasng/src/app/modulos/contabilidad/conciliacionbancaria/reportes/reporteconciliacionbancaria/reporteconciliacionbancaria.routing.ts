import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteconciliacionbancariaComponent } from './componentes/reporteconciliacionbancaria.component';


const routes: Routes = [
  { path: '', component: ReporteconciliacionbancariaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteconciliacionbancariaRoutingModule {}
