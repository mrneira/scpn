import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacturarComponent } from './componentes/facturar.component';

const routes: Routes = [
    {
        path: '', component: FacturarComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FacturarRoutingModule { }
