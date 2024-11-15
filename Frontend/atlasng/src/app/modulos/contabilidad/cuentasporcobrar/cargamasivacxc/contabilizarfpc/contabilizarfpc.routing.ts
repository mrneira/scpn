import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilizarFPCComponent } from './componentes/contabilizarfpc.component';

const routes: Routes = [
    {
        path: '', component: ContabilizarFPCComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContabilizarFPCRoutingModule { }
