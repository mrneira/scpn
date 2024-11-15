import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReportePagosModificadosRoutingModule } from './reportePagosModificados.routing';
import { ReportePagosModificadosComponent } from './componentes/reportePagosModificados.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ReportePagosModificadosRoutingModule,JasperModule ],
  declarations: [ReportePagosModificadosComponent]
})
export class ReportePagosModificadosModule { }
