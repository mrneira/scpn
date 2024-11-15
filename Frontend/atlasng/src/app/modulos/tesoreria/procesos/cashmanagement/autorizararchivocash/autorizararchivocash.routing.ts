import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizarArchivoCashComponent } from './componentes/autorizararchivocash.component';

const routes: Routes = [
  { path: '', component: AutorizarArchivoCashComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizarArchivoCashRoutingModule {}
