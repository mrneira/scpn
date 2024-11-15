import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuxiliarcontableinversionesComponent } from './componentes/auxiliarcontableinversiones.component';

const routes: Routes = [
  { path: '', component: AuxiliarcontableinversionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuxiliarcontableinversionesRoutingModule {}
