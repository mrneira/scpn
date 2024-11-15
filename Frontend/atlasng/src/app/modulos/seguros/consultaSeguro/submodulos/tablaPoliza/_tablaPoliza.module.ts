import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { TablaPolizaRoutingRouting } from './_tablaPoliza.routing';
import { TablaPolizaComponent } from './componentes/_tablaPoliza.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { GestorDocumentalModule } from '../../../../gestordocumental/gestordocumental.module';

@NgModule({
  imports: [SharedModule, TablaPolizaRoutingRouting, JasperModule, GestorDocumentalModule ],
  declarations: [TablaPolizaComponent],
  exports: [TablaPolizaComponent]
})
export class TablaPolizaModule { }
