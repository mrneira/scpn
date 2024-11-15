import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CruceNotasCreditoComprasComponent } from './componentes/crucenotascreditocompras.component';

const routes: Routes = [
  { path: '', component: CruceNotasCreditoComprasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CruceNotasCreditoComprasRoutingModule {}
