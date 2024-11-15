import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtractobancarioComponent } from './componentes/extractobancario.component';

const routes: Routes = [
  { path: '', component: ExtractobancarioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtractobancarioRoutingModule {}
