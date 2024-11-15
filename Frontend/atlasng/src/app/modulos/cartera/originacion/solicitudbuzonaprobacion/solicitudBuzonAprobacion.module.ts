import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SolicitudBuzonAprobacionRoutingModule } from './solicitudBuzonAprobacion.routing';
import { SolicitudBuzonAprobacionComponent } from './componentes/solicitudBuzonAprobacion.component';
import { SolicitudEtapaComponent } from './componentes/_solicitudEtapas.component';
import { SolicitudDesembolsoComponent } from './componentes/_solicitudDesembolso.component';

@NgModule({
  imports: [SharedModule, SolicitudBuzonAprobacionRoutingModule],
  declarations: [SolicitudBuzonAprobacionComponent, SolicitudEtapaComponent, SolicitudDesembolsoComponent],
  exports: [SolicitudEtapaComponent, SolicitudDesembolsoComponent]
})

export class SolicitudBuzonAprobacionModule { }
