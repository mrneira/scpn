import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CausalesVinculacionComponent } from './componentes/causalesVinculacion.component';

const routes: Routes = [
  { path: '', component: CausalesVinculacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CausalesVinculacionRoutingModule {}
