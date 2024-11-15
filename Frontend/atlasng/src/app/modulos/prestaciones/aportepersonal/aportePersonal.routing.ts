import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AportePersonalComponent } from './componentes/aportePersonal.component';

const routes: Routes = [
  { path: '', component: AportePersonalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AportePersonalRoutingModule {}
