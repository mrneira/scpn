import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { IndicadoresFinancierosRoutingModule } from './indicadoresFinancieros.routing';
import { IndicadoresFinancierosComponent } from './componentes/indicadoresFinancieros.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, IndicadoresFinancierosRoutingModule, JasperModule],
  declarations: [IndicadoresFinancierosComponent]
})
export class IndicadoresFinancierosModule { }
