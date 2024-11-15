import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstitucionFormalComponent } from './componentes/_institucionformal.component';

const routes: Routes = [
  { path: '', component: InstitucionFormalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionFormalRoutingModule {}
