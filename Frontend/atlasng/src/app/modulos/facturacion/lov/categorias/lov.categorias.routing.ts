import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCategoriasComponent } from './componentes/lov.categorias.component';

const routes: Routes = [
    {
        path: '', component: LovCategoriasComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LovCategoriasRoutingModule { }
