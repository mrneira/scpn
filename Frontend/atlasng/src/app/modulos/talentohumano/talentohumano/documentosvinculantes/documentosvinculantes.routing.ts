import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DocumentosVinculantesComponent } from './componentes/documentosvinculantes.component';

const routes: Routes = [
    {
        path: '', component: DocumentosVinculantesComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentosVinculantesRoutingModule { }
