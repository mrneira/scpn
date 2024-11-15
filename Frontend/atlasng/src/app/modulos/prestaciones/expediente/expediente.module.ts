
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ExpedienteRoutingModule } from './expediente.routing';
import { ExpedienteComponent } from './componentes/expediente.component';
import { DatosModule } from './submodulos/datossocio/_datos.module';
import { AnticipoModule } from './submodulos/anticipo/anticipo.module';
import { AportesModule } from './submodulos/aportes/aportes.module';
import { NovedadessocioModule } from './submodulos/novedadessocio/novedadessocio.module';
import { RetencionesModule } from './submodulos/retenciones/retenciones.module';
import { CarrerahistoricoModule } from './submodulos/carrerahistorico/carrerahistorico.module';
import { LiquidacionModule } from './submodulos/liquidacion/liquidacion.module';
import { PrestamosModule } from './submodulos/prestamos/prestamos.module';
import { BeneficiarioModule } from './submodulos/beneficiario/beneficiario.module';
import { DocumentosModule } from './submodulos/documentos/documentos.module';
import { ObservacionesModule } from './submodulos/observaciones/observaciones.module';
import { PagoInstucionesModule } from './submodulos/pagoinstituciones/pagoInstituciones.module';
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';
import { StepsModule } from 'primeng/primeng';
import { TooltipModule} from 'primeng/primeng';
@NgModule({
  imports: [SharedModule, StepsModule, ExpedienteRoutingModule, LovPersonasModule, 
    NovedadessocioModule, 
    DatosModule, 
    AnticipoModule,
    RetencionesModule,
    CarrerahistoricoModule,
    LiquidacionModule,
    AportesModule,
    PrestamosModule,
    BeneficiarioModule,
    DocumentosModule,
    ObservacionesModule,
    PagoInstucionesModule,
    JasperModule,TooltipModule],  
  declarations: [ExpedienteComponent], 
  exports: [ExpedienteComponent]
})  
export class ExpedienteModule { }

