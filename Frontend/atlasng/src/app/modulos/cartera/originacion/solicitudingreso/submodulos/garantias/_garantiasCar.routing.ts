import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GarantiasCarComponent } from './componentes/_garantiasCar.component';

const routes: Routes = [
  {
    path: '', component: GarantiasCarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GarantiasCarRoutingModule { }
