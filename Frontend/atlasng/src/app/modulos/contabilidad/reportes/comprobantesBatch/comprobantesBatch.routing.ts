import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComprobantesBatchComponent } from './componentes/comprobantesBatch.component';

const routes: Routes = [
  { path: '', component: ComprobantesBatchComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobantesBatchRoutingModule {}
