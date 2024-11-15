import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { HistorialCompromisoRoutingModule } from './historialCompromiso.routing';
import { HistorialCompromisoComponent } from './componentes/historialCompromiso.component';

@NgModule({
  imports: [SharedModule, HistorialCompromisoRoutingModule, JasperModule],
  declarations: [HistorialCompromisoComponent]
})
export class HistorialCompromisoModule { }
