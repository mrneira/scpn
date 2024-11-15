import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpuestoComponent } from './componentes/impuesto.component';

const routes: Routes = [
    {
        path: '', component: ImpuestoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImpuestoRoutingModule { }
