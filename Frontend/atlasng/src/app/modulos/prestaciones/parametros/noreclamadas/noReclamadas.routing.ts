import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoReclamadasComponent } from './componentes/noReclamadas.component';

const routes: Routes = [
  { path: '', component: NoReclamadasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoReclamadasRoutingModule {}
