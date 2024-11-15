import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { LovCategoriasRoutingModule } from './lov.categorias.routing';

import { LovCategoriasComponent } from './componentes/lov.categorias.component';
import { AccionesArbolModule } from '../../../../util/componentes/accionesarbol/accionesArbol.module';
import { TreeTableModule, SelectButtonModule } from 'primeng/primeng';

@NgModule({
    imports: [SharedModule, LovCategoriasRoutingModule, AccionesArbolModule, TreeTableModule, SelectButtonModule],
    declarations: [LovCategoriasComponent],
    exports: [LovCategoriasComponent]
})
export class LovCategoriasModule { }
