import { NgModule } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { GastosPersonalesRoutingModule } from './gastosPersonales.routing';
import { GastosPersonalesComponent } from './componentes/gastosPersonales.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, GastosPersonalesRoutingModule, JasperModule, LovFuncionariosModule,SpinnerModule],
  declarations: [GastosPersonalesComponent]
})
export class GastosPersonalesModule { }
