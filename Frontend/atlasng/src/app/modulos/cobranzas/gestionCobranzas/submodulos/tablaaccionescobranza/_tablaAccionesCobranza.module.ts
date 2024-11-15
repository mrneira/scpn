import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { TablaAccionesCobranzaRoutingRouting } from './_tablaAccionesCobranza.routing';
import { TablaAccionesCobranzaComponent } from './componentes/_tablaAccionesCobranza.component';

@NgModule({
  imports: [SharedModule, JasperModule, TablaAccionesCobranzaRoutingRouting ],
  declarations: [TablaAccionesCobranzaComponent],
  exports: [TablaAccionesCobranzaComponent]
})
export class TablaAccionesCobranzaModule { }
