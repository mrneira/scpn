import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { IngresoAjustesRoutingModule } from './ingreso.routing';

import { IngresoAjustesComponent } from './componentes/ingresoajustes.component';
import { ComprobanteModule } from './submodulos/comprobante/comprobante.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { LovPlantillasComprobanteModule } from '../../lov/plantillascomprobante/lov.plantillasComprobante.module';
import { LovConceptoContablesModule } from '../../lov/conceptocontables/lov.conceptoContables.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';
import { LovPartidaPresupuestariaModule } from '../../lov/partidapresupuestaria/lov.partidapresupuestaria.module';
import { DetallePlantillasComprobanteModule } from '../../parametros/detalleplantillascomprobante/detallePlantillasComprobante.module';
import { LovComprobantesModule } from '../../lov/comprobante/lov.comprobantes.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
import { LovClientesModule } from '../../../contabilidad/lov/clientes/lov.clientes.module';
import { LovAgenciasModule } from '../../../../modulos/generales/lov/agencias/lov.agencias.module';
import { LovSucursalesModule } from '../../../../modulos/generales/lov/sucursales/lov.sucursales.module';

@NgModule({
  imports: [SharedModule, IngresoAjustesRoutingModule, ComprobanteModule, DetalleModule, LovPlantillasComprobanteModule, LovConceptoContablesModule
  , LovCuentasContablesModule, DetallePlantillasComprobanteModule, LovPartidaPresupuestariaModule, LovComprobantesModule,JasperModule, 
  LovPersonasModule, LovProveedoresModule, LovClientesModule, LovAgenciasModule, LovSucursalesModule ],
  declarations: [IngresoAjustesComponent]
})
export class IngresoAjustesModule { }
