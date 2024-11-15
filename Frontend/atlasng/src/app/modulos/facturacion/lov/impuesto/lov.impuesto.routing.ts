import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovImpuestoComponent } from './componentes/lov.impuesto.component';

const routes: Routes = [
    {
        path: '', component: LovImpuestoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LovImpuestoRoutingModule { }
