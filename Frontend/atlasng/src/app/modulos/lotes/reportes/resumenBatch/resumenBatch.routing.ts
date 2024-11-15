import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenBatchComponent } from './componentes/resumenBatch.component';

const routes: Routes = [
  { path: '', component: ResumenBatchComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResumenBatchRoutingModule {}
