import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ConsultaExpedienteRoutingModule } from './consultaExpediente.routing';
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { ExpedienteModule } from './submodulos/expediente/expediente.module';
import { AnticipoModule } from './submodulos/anticipos/anticipo.module';
import { LiquidacionModule } from './submodulos/liquidacion/liquidacion.module';
import { NovedadessocioModule } from './submodulos/novedadessocio/novedadessocio.module';
import { PrestamosModule } from './submodulos/prestamos/prestamos.module';
import { RetencionesModule } from './submodulos/retenciones/retenciones.module';
import { BeneficiarioModule } from './submodulos/beneficiario/beneficiario.module';
import { ObservacionesModule } from './submodulos/observaciones/observaciones.module';
import { ConsultaExpedienteComponent } from './componentes/consultaExpediente.component';


@NgModule({
  imports: [SharedModule, ConsultaExpedienteRoutingModule, LovPersonasModule, ExpedienteModule, AnticipoModule, LiquidacionModule, PrestamosModule, NovedadessocioModule, RetencionesModule, BeneficiarioModule, ObservacionesModule ],
  declarations: [ConsultaExpedienteComponent]
})
export class ConsultaExpedienteModule { }
