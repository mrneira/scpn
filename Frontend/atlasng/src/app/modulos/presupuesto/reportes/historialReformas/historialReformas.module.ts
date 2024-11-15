import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { HistorialReformasRoutingModule } from './historialReformas.routing';
import { HistorialReformasComponent } from './componentes/historialReformas.component';

@NgModule({
  imports: [SharedModule, HistorialReformasRoutingModule, JasperModule],
  declarations: [HistorialReformasComponent]
})
export class HistorialReformasModule { }
