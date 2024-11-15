import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovBeneficioComponent } from './componentes/lov.beneficio.component';

const routes: Routes = [
  {
    path: '', component: LovBeneficioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovBeneficioRoutingModule {}
