import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrecancelacionrfComponent } from './componentes/precancelacionrf.component';

const routes: Routes = [
  { path: '', component: PrecancelacionrfComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrecancelacionrfRoutingModule {}
