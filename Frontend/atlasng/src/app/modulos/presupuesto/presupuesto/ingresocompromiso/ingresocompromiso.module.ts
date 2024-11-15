import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { IngresoCompromisoRoutingModule } from '../ingresocompromiso/ingresocompromiso.routing';

import { IngresoCompromisoComponent } from './componentes/ingresocompromiso.component';
import { ComprobanteModule } from './submodulos/comprobante/comprobante.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
import { LovClientesModule } from '../../../contabilidad/lov/clientes/lov.clientes.module';
import { LovAgenciasModule } from '../../../../modulos/generales/lov/agencias/lov.agencias.module';
import { LovSucursalesModule } from '../../../../modulos/generales/lov/sucursales/lov.sucursales.module';

@NgModule({
  imports: [SharedModule, IngresoCompromisoRoutingModule, ComprobanteModule, DetalleModule, JasperModule, 
  LovPersonasModule, LovProveedoresModule, LovClientesModule, LovAgenciasModule, LovSucursalesModule ],
  declarations: [IngresoCompromisoComponent]
})
export class IngresoCompromisoModule { }
