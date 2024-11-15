import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaBceComponent } from './componentes/cargabce.component';

const routes: Routes = [
  { path: '', component: CargaBceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaBceRoutingModule {}
