import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InternacionalComponent } from './componentes/internacional.component';

const routes: Routes = [
  { path: '', component: InternacionalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternacionalRoutingModule {}
