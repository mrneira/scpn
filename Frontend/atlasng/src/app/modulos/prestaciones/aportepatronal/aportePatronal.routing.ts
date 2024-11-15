import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AportePatronalComponent } from './componentes/aportePatronal.component';

const routes: Routes = [
  { path: '', component: AportePatronalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AportePatronalRoutingModule {}
