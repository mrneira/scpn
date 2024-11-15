import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CedulaPresupuestariaGastoConsultaRoutingModule } from './cedulaPresupuestariaGastoConsulta.routing';
import { CedulaPresupuestariaGastoConsultaComponent } from './componentes/cedulaPresupuestariaGastoConsulta.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPartidaGastoModule } from "../../lov/partidagasto/lov.partidagasto.module";
import { TooltipModule} from 'primeng/primeng'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [
    SharedModule, 
    CedulaPresupuestariaGastoConsultaRoutingModule, 
    LovPersonasModule, 
    LovPartidaGastoModule,TooltipModule,JasperModule ],
  declarations: [CedulaPresupuestariaGastoConsultaComponent],
  exports: [CedulaPresupuestariaGastoConsultaComponent]
})
export class CedulaPresupuestariaGastoConsultaModule { }
