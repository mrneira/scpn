import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresocxpComponent } from './componentes/ingresocxp.component';

const routes: Routes = [
  { path: '', component: IngresocxpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresocxpRoutingModule {}
