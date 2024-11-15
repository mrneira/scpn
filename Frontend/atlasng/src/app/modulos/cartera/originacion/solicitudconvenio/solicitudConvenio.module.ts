import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { StepsModule } from 'primeng/primeng';
import { SolicitudConvenioRoutingModule } from './solicitudConvenio.routing';
import { SolicitudConvenioComponent } from './componentes/solicitudConvenio.component';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './submodulos/datosgenerales/_datosGenerales.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../personas/lov/personavista/lov.personaVista.module';
import { TablaAmortizacionModule } from '../solicitudingreso/submodulos/tablaamortizacion/_tablaAmortizacion.module';
import { CapacidadPagoModule } from './submodulos/capacidadpago/_capacidadPago.module';

@NgModule({
  imports: [SharedModule, StepsModule, SolicitudConvenioRoutingModule, DatosGeneralesModule, ProductoModule,
    TipoProductoModule, LovPersonasModule, LovPersonaVistaModule, TablaAmortizacionModule, CapacidadPagoModule],
  declarations: [SolicitudConvenioComponent]
})
export class SolicitudConvenioModule { }
