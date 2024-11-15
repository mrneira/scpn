import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacacionManualComponent } from './componentes/vacacionmanual.component';

const routes: Routes = [
  { path: '', component: VacacionManualComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacacionmanualRoutingModule {}
