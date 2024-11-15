import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionPersonalComponent } from './componentes/_infPersonal.component';

const routes: Routes = [
  { path: '', component: InformacionPersonalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformacionPersonalRoutingModule {}
