import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AporteComponent } from './componentes/aporte.component';

const routes: Routes = [
  { path: '', component: AporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AporteRoutingModule {}
