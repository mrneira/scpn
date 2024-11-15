import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { CobranzaRoutingRouting } from './_cobranza.routing';
import { CobranzaComponent } from './componentes/_cobranza.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, CobranzaRoutingRouting, JasperModule ],
  declarations: [CobranzaComponent],
  exports: [CobranzaComponent]
})
export class CobranzaModule { }
