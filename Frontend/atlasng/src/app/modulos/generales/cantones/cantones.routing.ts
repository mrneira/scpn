import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CantonesComponent } from './componentes/cantones.component';

const routes: Routes = [
  { path: '', component: CantonesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CantonesRoutingModule {}
