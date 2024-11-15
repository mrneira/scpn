import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { ImpuestoRoutingModule } from './impuesto.routing';

import { ImpuestoComponent } from './componentes/impuesto.component';
import { AccionesArbolModule } from 'app/util/componentes/accionesarbol/accionesArbol.module';
import { TreeTableModule, SelectButtonModule } from 'primeng/primeng';
import { LovTransaccionesModule } from 'app/modulos/generales/lov/transacciones/lov.transacciones.module';
import { LovCuentasContablesModule } from 'app/modulos/contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
    imports: [SharedModule, ImpuestoRoutingModule, AccionesArbolModule, TreeTableModule, LovTransaccionesModule, LovCuentasContablesModule, SelectButtonModule],
    declarations: [ImpuestoComponent]
})
export class ImpuestoModule { }
