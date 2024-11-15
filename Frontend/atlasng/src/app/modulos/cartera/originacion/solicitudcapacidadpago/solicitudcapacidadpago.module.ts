import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { StepsModule } from 'primeng/primeng';
import { SolicitudCapacidadPagoRoutingModule } from './solicitudcapacidadpago.routing';
import { SolicitudCapacidadPagoComponent } from './componentes/solicitudcapacidadpago.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './submodulos/datosgenerales/_datosGenerales.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../personas/lov/personavista/lov.personaVista.module';
import { TablaAmortizacionModule } from '../solicitudingreso/submodulos/tablaamortizacion/_tablaAmortizacion.module';
import { CapacidadPagoModule } from './submodulos/capacidadpago/_capacidadPago.module';
import { GaranteModule } from './submodulos/garante/_garante.module';
import { EspecialModule } from './submodulos/especial/_especial.module';

@NgModule({
  imports: [SharedModule, StepsModule, SolicitudCapacidadPagoRoutingModule, DatosGeneralesModule, ProductoModule,
    TipoProductoModule, LovPersonasModule, LovPersonaVistaModule, TablaAmortizacionModule, CapacidadPagoModule, GaranteModule,
    EspecialModule],
  declarations: [SolicitudCapacidadPagoComponent]
})
export class SolicitudCapacidadPagoModule { }
