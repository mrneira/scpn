import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuzonIngPolizaPrendarioComponent } from './componentes/buzonIngPolizaPrendario.component';

const routes: Routes = [
  { path: '', component: BuzonIngPolizaPrendarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuzonIngPolizaPrendarioRoutingModule {}
