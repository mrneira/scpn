import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { LovImpuestoRoutingModule } from './lov.impuesto.routing';

import { LovImpuestoComponent } from './componentes/lov.impuesto.component';
import { AccionesArbolModule } from '../../../../util/componentes/accionesarbol/accionesArbol.module';

import { TreeTableModule, SelectButtonModule } from 'primeng/primeng';

@NgModule({
    imports: [SharedModule, LovImpuestoRoutingModule, AccionesArbolModule, TreeTableModule, SelectButtonModule],
    declarations: [LovImpuestoComponent],
    exports: [LovImpuestoComponent]
})
export class LovImpuestoModule { }
