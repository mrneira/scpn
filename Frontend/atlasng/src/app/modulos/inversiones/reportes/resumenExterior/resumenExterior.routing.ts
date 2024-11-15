import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenExteriorComponent } from './componentes/resumenExterior.component';

const routes: Routes = [
  { path: '', component: ResumenExteriorComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResumenExteriorRoutingModule {}
