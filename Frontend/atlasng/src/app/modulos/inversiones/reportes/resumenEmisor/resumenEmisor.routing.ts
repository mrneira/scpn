import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenEmisorComponent } from './componentes/resumenEmisor.component';

const routes: Routes = [
  { path: '', component: ResumenEmisorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenEmisorRoutingModule {}
