import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import {LiquidacionRoutingModule } from './liquidacion.routing';
import { LiquidacionComponent } from './componentes/liquidacion.component';
import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';
import { JasperModule } from '../.././../../../util/componentes/jasper/jasper.module';


import{ParametroAnualModule} from '../../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, LiquidacionRoutingModule,LovFuncionariosModule,ParametroAnualModule,JasperModule],
  declarations: [LiquidacionComponent]
})
export class LiquidacionModule { }
