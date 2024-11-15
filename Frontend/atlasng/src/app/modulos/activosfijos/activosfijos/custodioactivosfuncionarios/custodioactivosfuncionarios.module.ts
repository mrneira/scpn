import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CustodioActivosFuncionariosRoutingModule } from './custodioactivosfuncionarios.routing';

import { CustodioActivosFuncionariosComponent } from './componentes/custodioactivosfuncionarios.component';
import { LovKardexCodificadoModule } from '../../lov/kardexcodificado/lov.kardexcodificado.module';


@NgModule({
  imports: [SharedModule, CustodioActivosFuncionariosRoutingModule,LovKardexCodificadoModule ],
  declarations: [CustodioActivosFuncionariosComponent]
})
export class CustodioActivosFuncionariosModule { }
