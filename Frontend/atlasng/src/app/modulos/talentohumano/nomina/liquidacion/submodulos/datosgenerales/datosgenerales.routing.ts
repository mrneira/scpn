import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosgeneralesComponent } from './componentes/datosgenerales.component';

const routes: Routes = [
  { path: '', component: DatosgeneralesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosgeneralesRoutingModule {}
