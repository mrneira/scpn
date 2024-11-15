import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficioComponent } from './componentes/beneficio.component';

const routes: Routes = [
  { path: '', component: BeneficioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficioRoutingModule {}
