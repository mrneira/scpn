import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenconciliacionComponent } from './componentes/resumenconciliacion.component';

const routes: Routes = [
  { path: '', component: ResumenconciliacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenconciliacionRoutingModule {}
