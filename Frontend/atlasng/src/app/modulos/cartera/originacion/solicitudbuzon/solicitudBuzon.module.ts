import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SolicitudBuzonRoutingModule } from './solicitudBuzon.routing';
import { SolicitudBuzonComponent } from './componentes/solicitudBuzon.component';
import { SolicitudEtapaComponent } from './componentes/_solicitudEtapas.component';

@NgModule({
  imports: [SharedModule, SolicitudBuzonRoutingModule],
  declarations: [SolicitudBuzonComponent, SolicitudEtapaComponent],
  exports: [SolicitudEtapaComponent]
})

export class SolicitudBuzonModule { }
