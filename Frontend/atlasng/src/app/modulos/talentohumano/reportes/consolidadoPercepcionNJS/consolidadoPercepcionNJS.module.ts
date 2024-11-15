import { NgModule } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsolidadoPercepcionNJSRoutingModule } from './consolidadoPercepcionNJS.routing';
import { ConsolidadoPercepcionNJSComponent } from './componentes/consolidadoPercepcionNJS.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, ConsolidadoPercepcionNJSRoutingModule, JasperModule, LovFuncionariosModule,SpinnerModule],
  declarations: [ConsolidadoPercepcionNJSComponent]
})
export class ConsolidadoPercepcionNJSModule { }
