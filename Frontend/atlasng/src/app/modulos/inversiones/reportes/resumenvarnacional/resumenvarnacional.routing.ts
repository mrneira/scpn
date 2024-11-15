import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenvarNacionalComponent } from './componentes/resumenvarnacional.component';

const routes: Routes = [
  { path: '', component: ResumenvarNacionalComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResumenvarNacionalRoutingModule {}
