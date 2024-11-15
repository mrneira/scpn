import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BienesPorCustodioRoutingModule } from './bienesPorCustodio.routing';
import { BienesPorCustodioComponent } from './componentes/bienesPorCustodio.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, BienesPorCustodioRoutingModule, JasperModule, LovProductosModule, LovFuncionariosModule ],
  declarations: [BienesPorCustodioComponent]
})
export class BienesPorCustodioModule { }
