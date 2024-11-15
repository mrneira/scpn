import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnfermedadesComponent } from './componentes/_enfermedades.component';

const routes: Routes = [
  { path: '', component: EnfermedadesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnfermedadesRoutingModule {}
