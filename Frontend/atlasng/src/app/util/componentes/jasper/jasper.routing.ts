import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JasperComponent } from './componentes/jasper.component';

const routes: Routes = [
  {
    path: '', component: JasperComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JasperRoutingModule {}
