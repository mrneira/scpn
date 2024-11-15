import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilizarFPComponent } from './componentes/contabilizarfp.component';

const routes: Routes = [
    {
        path: '', component: ContabilizarFPComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContabilizarFPRoutingModule { }
