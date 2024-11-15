import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovClienteComponent } from './componentes/lov.cliente.component';

const routes: Routes = [
    {
        path: '', component: LovClienteComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LovClienteRoutingModule { }
