import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasaReferencialComponent } from './componentes/tasareferencial.component';

const routes: Routes = [
  { path: '', component: TasaReferencialComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasaReferencialRoutingModule {}
