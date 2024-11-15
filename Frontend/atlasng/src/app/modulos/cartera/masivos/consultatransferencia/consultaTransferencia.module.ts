import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../util/shared/shared.module";
import { ConsultaTransferenciaRoutingModule } from "./consultaTransferencia.routing";
import { ConsultaTransferenciaComponent } from "./componentes/consultaTransferencia.component";
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ConsultaTransferenciaRoutingModule, JasperModule],
  declarations: [ConsultaTransferenciaComponent]
})
export class ConsultaTransferenciaModule { }
