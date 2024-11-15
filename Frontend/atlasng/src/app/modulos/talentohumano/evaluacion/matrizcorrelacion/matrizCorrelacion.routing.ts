import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatrizCorrelacionComponent } from './componentes/matrizCorrelacion.component';

const routes: Routes = [
  { path: '', component: MatrizCorrelacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatrizCorrelacionRoutingModule {}
