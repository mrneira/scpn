import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { TablaPolizaIncrementoRoutingRouting } from './_tablaPolizaIncremento.routing';
import { TablaPolizaIncrementoComponent } from './componentes/_tablaPolizaIncremento.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, TablaPolizaIncrementoRoutingRouting, JasperModule ],
  declarations: [TablaPolizaIncrementoComponent],
  exports: [TablaPolizaIncrementoComponent]
})
export class TablaPolizaIncrementoModule { }
