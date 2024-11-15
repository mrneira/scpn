import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { TablaAccionesCobranzaRoutingRouting } from './_tablaAccionesCobranza.routing';
import { TablaAccionesCobranzaComponent } from './componentes/_tablaAccionesCobranza.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, TablaAccionesCobranzaRoutingRouting, JasperModule ],
  declarations: [TablaAccionesCobranzaComponent],
  exports: [TablaAccionesCobranzaComponent]
})
export class TablaAccionesCobranzaModule { }
