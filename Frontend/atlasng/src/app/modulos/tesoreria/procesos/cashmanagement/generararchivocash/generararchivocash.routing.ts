import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarArchivoCashComponent } from './componentes/generararchivocash.component';

const routes: Routes = [
  { path: '', component: GenerarArchivoCashComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarArchivoCashRoutingModule {}
