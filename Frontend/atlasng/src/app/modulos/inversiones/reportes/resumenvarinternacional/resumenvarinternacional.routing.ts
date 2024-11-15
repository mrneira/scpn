import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenvarInternacionalComponent } from './componentes/resumenvarinternacional.component';

const routes: Routes = [
  { path: '', component: ResumenvarInternacionalComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResumenvarInternacionalRoutingModule {}
