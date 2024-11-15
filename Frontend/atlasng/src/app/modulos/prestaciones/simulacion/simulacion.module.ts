
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { SimulacionRoutingModule } from './simulacion.routing';
import { SimulacionComponent } from './componentes/simulacion.component';
import { AportesModule } from './submodulos/aportes/aportes.module';
import { NovedadessocioModule } from './submodulos/novedadessocio/novedadessocio.module';
import { RetencionesModule } from './submodulos/retenciones/retenciones.module';
import { CarrerahistoricoModule } from './submodulos/carrerahistorico/carrerahistorico.module';
import { PrestamosModule } from './submodulos/prestamos/prestamos.module';
import { ObservacionesModule } from './submodulos/observaciones/observaciones.module';
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';
import { StepsModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, StepsModule, SimulacionRoutingModule, LovPersonasModule, 
    NovedadessocioModule, 
    RetencionesModule,
    CarrerahistoricoModule,
    AportesModule,
    PrestamosModule,
    ObservacionesModule,
    JasperModule],  
  declarations: [SimulacionComponent], 
  exports: [SimulacionComponent]
})  
export class SimulacionModule { }

